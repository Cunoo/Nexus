package com.nexus.backend.ai.dto;

import java.time.LocalDateTime;

public record ChatMessageDto(
        Long id,
        String sender, // "user" orß "bot"
        String text,
        LocalDateTime createdAt
) {}