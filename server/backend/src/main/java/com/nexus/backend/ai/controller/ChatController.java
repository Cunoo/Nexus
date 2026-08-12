package com.nexus.backend.ai.controller;

import com.nexus.backend.ai.dto.ChatMessageDto;
import com.nexus.backend.ai.dto.ChatRequest;
import com.nexus.backend.ai.dto.ChatResponse;
import com.nexus.backend.ai.entity.ChatConversation;
import com.nexus.backend.ai.repository.ChatConversationRepository;
import com.nexus.backend.ai.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/user/api/chat")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;
    private final ChatConversationRepository conversationRepository;

    /**
     * Extracts the user ID from the Spring Security UserDetails principal.
     */
    private Long extractUserId(UserDetails userDetails) {
        if (userDetails != null && userDetails.getUsername() != null) {
            try {
                return Long.valueOf(userDetails.getUsername());
            } catch (NumberFormatException e) {
                return null;
            }
        }
        return null;
    }

    /**
     * Standard synchronous chat endpoint.
     */
//    @PostMapping
//    public ChatResponse chat(
//            @RequestBody ChatRequest request,
//            @AuthenticationPrincipal UserDetails userDetails) {
//
//        Long userId = extractUserId(userDetails);
//        return chatService.processChat(request, userId);
//    }

    /**
     * Retrieves all chat conversations for the authenticated user, ordered by recent updates.
     */
    @GetMapping("/conversations")
    public List<ChatConversation> getUserConversations(@AuthenticationPrincipal UserDetails userDetails) {
        Long userId = extractUserId(userDetails);
        if (userId == null) {
            return List.of();
        }
        return conversationRepository.findByUserIdOrderByUpdatedAtDesc(userId);
    }

    /**
     * Retrieves all message history for a specific conversation.
     */
    @GetMapping("/conversations/{conversationId}/messages")
    public List<ChatMessageDto> getMessages(@PathVariable Long conversationId) {
        return chatService.getConversationMessages(conversationId);
    }

    /**
     * Streaming chat endpoint using Server-Sent Events (SSE).
     * Returns a reactive Flux of token chunks wrapped in a JSON map.
     */
    @PostMapping(value = "/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE + ";charset=UTF-8")
    public ResponseEntity<Flux<Map<String, String>>> chatStream(
            @RequestBody ChatRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {

        Long userId = extractUserId(userDetails);

        // 1. Get or create conversation once beforehand
        ChatConversation conversation = chatService.getOrCreateConversation(
                request.conversationId(),
                request.message(),
                userId
        );

        // 2. Process chat stream and map each token to a JSON-compatible Map structure
        Flux<Map<String, String>> stream = chatService.processChatStream(conversation.getId(), request.message(), userId)
                .map(token -> Map.of("content", token));

        // 3. Return response with the conversation ID exposed in custom headers
        return ResponseEntity.ok()
                .header("X-Conversation-Id", String.valueOf(conversation.getId()))
                .header(HttpHeaders.ACCESS_CONTROL_EXPOSE_HEADERS, "X-Conversation-Id")
                .body(stream);
    }
}