package com.nexus.backend.ai.dto;

import lombok.Builder;

@Builder
public record ChatResponse(
        Long conversationId,
        String reply
) {}