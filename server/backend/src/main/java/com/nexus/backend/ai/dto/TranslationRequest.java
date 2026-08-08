package com.nexus.backend.ai.dto;

public record TranslationRequest(
        String sourceLang,
        String targetLang,
        String text
) {}