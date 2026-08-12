package com.nexus.backend.ai.repository;

import com.nexus.backend.ai.entity.ChatConversation;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ChatConversationRepository extends JpaRepository<ChatConversation, Long> {
    List<ChatConversation> findByUserIdOrderByUpdatedAtDesc(Long userId);
}