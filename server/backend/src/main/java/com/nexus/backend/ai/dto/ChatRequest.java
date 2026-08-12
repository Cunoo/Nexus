// ChatRequest.java
package com.nexus.backend.ai.dto;

public record ChatRequest(
        Long conversationId, // null = new conversation
        String message
) {}