package com.nexus.backend.ai.dto;

public record TranslationResponse (
    String dscLang,
    String text
) {}