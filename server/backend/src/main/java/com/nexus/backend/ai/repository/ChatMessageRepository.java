package com.nexus.backend.ai.repository;

import com.nexus.backend.ai.entity.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    // Loading the message history for this conversation, sorted by time
    List<ChatMessage> findByConversationIdOrderByCreatedAtAsc(Long conversationId);
}