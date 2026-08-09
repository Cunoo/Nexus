package com.nexus.backend.ai.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record TranslationRequest(
        @NotBlank(message = "Source language cannot be blank")
        String sourceLang,

        @NotBlank(message = "Target language cannot be blank")
        String targetLang,

        @NotBlank(message = "Text to translate cannot be empty")
        @Size(max = 10000, message = "Text exceeds the maximum limit of 10,000 characters")
        String text
) {}