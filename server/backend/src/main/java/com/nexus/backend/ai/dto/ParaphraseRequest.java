package com.nexus.backend.ai.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ParaphraseRequest(
        @NotBlank(message = "Text cannot be empty")
        @Size(max = 5000, message = "Text exceeds maximum length of 5000 characters")
        String text,

        String tone, //  "standard", "formal", "casual", "academic", "fluent"
        String language // "en", "sk", "de"
) {
}