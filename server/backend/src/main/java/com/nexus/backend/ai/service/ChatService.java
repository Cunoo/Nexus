package com.nexus.backend.ai.service;

import com.nexus.backend.ai.dto.ChatMessageDto;
import com.nexus.backend.ai.dto.ChatRequest;
import com.nexus.backend.ai.dto.ChatResponse;
import com.nexus.backend.ai.entity.ChatConversation;
import reactor.core.publisher.Flux;

import java.util.List;

public interface ChatService {
    //public ChatResponse processChat(ChatRequest request, Long userId);
    ChatConversation getOrCreateConversation(Long conversationId, String firstMessage, Long userId);
    public List<ChatMessageDto> getConversationMessages(Long conversationId);
    Flux<String> processChatStream(Long conversationId, String message, Long userId);
}