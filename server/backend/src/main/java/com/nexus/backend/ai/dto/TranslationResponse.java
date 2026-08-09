package com.nexus.backend.ai.dto;

import java.time.OffsetDateTime;

public record TranslationResponse(
        Long id,                   // ID of the DB record (crucial for favoriting/deleting)
        String sourceLang,
        String targetLang,         // Replaced 'dscLang' for naming consistency
        String originalText,
        String translatedText,
        boolean cached,            // Lets frontend know if response was instant ($0 cost)
        String modelUsed,          // AI model used (useful for multi-model / freemium UI)
        Long latencyMs,            // Time taken in milliseconds
        boolean isFavorite,
        OffsetDateTime createdAt
) {
    /**
     * Factory method for creating a lightweight response when minimal data is needed.
     */
    public static TranslationResponse simple(String targetLang, String translatedText) {
        return new TranslationResponse(
                null, null, targetLang, null, translatedText,
                false, null, null, false, OffsetDateTime.now()
        );
    }
}