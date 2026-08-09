package com.nexus.backend.ai.dto;

public record ParaphraseResponse(
        String originalText,
        String paraphrasedText,
        String tone,
        String language
) {
}