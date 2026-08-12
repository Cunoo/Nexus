package com.nexus.backend.ai.service;

import com.nexus.backend.ai.entity.ChatConversation;
import com.nexus.backend.ai.entity.ChatMessage;
import com.nexus.backend.ai.repository.ChatConversationRepository;
import com.nexus.backend.ai.repository.ChatMessageRepository;
import com.nexus.backend.user.entity.User;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class ChatTransactionService {

    private final ChatConversationRepository conversationRepository;
    private final ChatMessageRepository messageRepository;
    private final EntityManager entityManager;

    /**
     * Gets or creates a conversation, saves the incoming user message, and returns the conversation.
     */
    @Transactional
    public ChatConversation getOrCreateAndSaveUserMessage(Long conversationId, String messageText, Long userId) {
        ChatConversation conversation;

        if (conversationId != null) {
            conversation = conversationRepository.findById(conversationId)
                    .orElseThrow(() -> new IllegalArgumentException("Conversation not found ID: " + conversationId));
        } else {
            // Create new conversation if ID is not provided
            String title = messageText.length() > 30 ? messageText.substring(0, 30) + "..." : messageText;
            User userRef = (userId != null) ? entityManager.getReference(User.class, userId) : null;

            conversation = ChatConversation.builder()
                    .title(title)
                    .user(userRef)
                    .build();

            conversation = conversationRepository.save(conversation);
        }

        // Save the incoming user message
        ChatMessage userMsg = ChatMessage.builder()
                .conversation(conversation)
                .role(ChatMessage.Role.USER)
                .content(messageText)
                .build();
        messageRepository.save(userMsg);

        return conversation;
    }

    /**
     * Safely saves the final bot response and updates the conversation timestamp.
     */
    @Transactional
    public void saveBotMessage(Long conversationId, String botContent, Integer promptTokens, Integer completionTokens) {
        ChatConversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new IllegalArgumentException("Conversation not found ID: " + conversationId));

        ChatMessage botMsg = ChatMessage.builder()
                .conversation(conversation)
                .role(ChatMessage.Role.ASSISTANT)
                .content(botContent)
                .promptTokens(promptTokens)
                .completionTokens(completionTokens)
                .build();

        messageRepository.save(botMsg);

        // Update conversation last modified timestamp
        conversation.setUpdatedAt(LocalDateTime.now());
        conversationRepository.save(conversation);
    }
}