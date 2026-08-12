package com.nexus.backend.ai.service;

import com.nexus.backend.ai.dto.ChatMessageDto;
import com.nexus.backend.ai.dto.ChatRequest;
import com.nexus.backend.ai.dto.ChatResponse;
import com.nexus.backend.ai.entity.ChatConversation;
import com.nexus.backend.ai.entity.ChatMessage;
import com.nexus.backend.ai.repository.ChatConversationRepository;
import com.nexus.backend.ai.repository.ChatMessageRepository;
import com.nexus.backend.user.entity.User;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.messages.AssistantMessage;
import org.springframework.ai.chat.messages.Message;
import org.springframework.ai.chat.messages.SystemMessage;
import org.springframework.ai.chat.messages.UserMessage;
import org.springframework.ai.chat.model.ChatModel;
import org.springframework.ai.chat.model.StreamingChatModel;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import reactor.core.publisher.Flux;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;

@Slf4j
@Service
@RequiredArgsConstructor
public class ChatServiceImpl implements ChatService {

    private final ChatModel chatModel;
    private final StreamingChatModel streamingChatModel;
    private final ChatConversationRepository conversationRepository;
    private final ChatMessageRepository messageRepository;
    private final ChatTransactionService chatTransactionService; // Injected transaction helper
    private final EntityManager entityManager;

    private static final String SYSTEM_INSTRUCTION = """
        You are a helpful, friendly AI assistant.
        Provide direct and useful answers. Match the language of the user.
        """;

    @Override
    public ChatConversation getOrCreateConversation(Long conversationId, String firstMessage, Long userId) {
        if (conversationId != null) {
            return conversationRepository.findById(conversationId)
                    .orElseThrow(() -> new IllegalArgumentException("Conversation not found ID: " + conversationId));
        }

        // Create new conversation
        String title = firstMessage.length() > 30 ? firstMessage.substring(0, 30) + "..." : firstMessage;
        User userRef = (userId != null) ? entityManager.getReference(User.class, userId) : null;

        ChatConversation conversation = ChatConversation.builder()
                .title(title)
                .user(userRef)
                .build();

        return conversationRepository.save(conversation);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ChatMessageDto> getConversationMessages(Long conversationId) {
        return messageRepository.findByConversationIdOrderByCreatedAtAsc(conversationId)
                .stream()
                .map(msg -> new ChatMessageDto(
                        msg.getId(),
                        msg.getRole() == ChatMessage.Role.USER ? "user" : "ASSISTANT",
                        msg.getContent(),
                        msg.getCreatedAt()
                ))
                .toList();
    }

    @Override
    public Flux<String> processChatStream(Long conversationId, String messageText, Long userId) {
        // 1. Get or create conversation and safely save user message within a proper transactional boundary
        ChatConversation conversation = chatTransactionService.getOrCreateAndSaveUserMessage(conversationId, messageText, userId);

        // 2. Prepare message history for the AI prompt
        List<ChatMessage> history = messageRepository.findByConversationIdOrderByCreatedAtAsc(conversation.getId());
        List<Message> springAiMessages = new ArrayList<>();
        springAiMessages.add(new SystemMessage(SYSTEM_INSTRUCTION));

        for (ChatMessage msg : history) {
            if (msg.getRole() == ChatMessage.Role.USER) {
                springAiMessages.add(new UserMessage(msg.getContent()));
            } else if (msg.getRole() == ChatMessage.Role.ASSISTANT) {
                springAiMessages.add(new AssistantMessage(msg.getContent()));
            }
        }

        Prompt prompt = new Prompt(springAiMessages);
        StringBuilder fullBotReply = new StringBuilder();

        AtomicInteger promptTokensCount = new AtomicInteger(0);
        AtomicInteger completionTokensCount = new AtomicInteger(0);

        // 3. Process stream with token collection and safety meta-line filtering
        return streamingChatModel.stream(prompt)
                .map(chatResponse -> {
                    // Capture token usage metadata if provided by provider in chunks
                    if (chatResponse.getMetadata() != null && chatResponse.getMetadata().getUsage() != null) {
                        var usage = chatResponse.getMetadata().getUsage();
                        promptTokensCount.set((int) usage.getPromptTokens());
                        completionTokensCount.set(Math.toIntExact(usage.getCompletionTokens()));
                    }

                    if (chatResponse.getResult() == null || chatResponse.getResult().getOutput() == null) {
                        return "";
                    }
                    String token = chatResponse.getResult().getOutput().getText();
                    return token != null ? token : "";
                })
                .map(token -> token.replaceAll("(?m)^(User|Response)\\s+Safety:.*\\r?\\n?", ""))
                .filter(token -> !token.isEmpty())
                .doOnNext(fullBotReply::append)
                .doOnError(error -> {
                    log.error("AI stream was corrupted: {}", error.getMessage());
                })
                .doOnComplete(() -> {
                    // 4. Safely save the complete bot message via external transactional service
                    chatTransactionService.saveBotMessage(
                            conversation.getId(),
                            fullBotReply.toString(),
                            promptTokensCount.get(),
                            completionTokensCount.get()
                    );
                    log.info("Stream finished and saved successfully. Tokens - Prompt: {}, Completion: {}",
                            promptTokensCount.get(), completionTokensCount.get());
                });
    }

    //    @Override
//    @Transactional
//    public ChatResponse processChat(ChatRequest request, Long userId) {
//        // 1. Get or create conversation
//        ChatConversation conversation = getOrCreateConversation(request.conversationId(), request.message(), userId);
//
//        // 2. Fetch message history from DB
//        List<ChatMessage> history = messageRepository.findByConversationIdOrderByCreatedAtAsc(conversation.getId());
//
//        // 3. Construct messages for Spring AI ChatModel
//        List<Message> springAiMessages = new ArrayList<>();
//        springAiMessages.add(new SystemMessage(SYSTEM_INSTRUCTION));
//
//        // Add older conversation history
//        for (ChatMessage msg : history) {
//            if (msg.getRole() == ChatMessage.Role.USER) {
//                springAiMessages.add(new UserMessage(msg.getContent()));
//            } else if (msg.getRole() == ChatMessage.Role.ASSISTANT) {
//                springAiMessages.add(new AssistantMessage(msg.getContent()));
//            }
//        }
//
//        // Add the current new user message
//        springAiMessages.add(new UserMessage(request.message()));
//
//        // 4. Save user message to DB
//        ChatMessage userMsg = ChatMessage.builder()
//                .conversation(conversation)
//                .role(ChatMessage.Role.USER)
//                .content(request.message())
//                .build();
//        messageRepository.save(userMsg);
//
//        // 5. Call AI Model with full conversation history and track token usage
//        Prompt prompt = new Prompt(springAiMessages);
//        var chatResponse = chatModel.call(prompt);
//
//        String botReply = chatResponse.getResult().getOutput().getText();
//
//        var usage = chatResponse.getMetadata().getUsage();
//        Integer promptTok = (usage != null) ? (int) usage.getPromptTokens() : 0;
//        Integer completionTok = (usage != null) ? (int) usage.getCompletionTokens() : 0;
//
//        // 6. Save bot response to DB with tokens
//        ChatMessage botMsg = ChatMessage.builder()
//                .conversation(conversation)
//                .role(ChatMessage.Role.ASSISTANT)
//                .content(botReply)
//                .promptTokens(promptTok)
//                .completionTokens(completionTok)
//                .build();
//        messageRepository.save(botMsg);
//
//        // Update conversation timestamp
//        conversationRepository.save(conversation);
//
//        return ChatResponse.builder()
//                .conversationId(conversation.getId())
//                .reply(botReply)
//                .build();
//    }

}