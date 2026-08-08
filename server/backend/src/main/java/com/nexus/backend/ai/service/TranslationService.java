package com.nexus.backend.ai.service;

import com.nexus.backend.ai.dto.TranslationRequest;
import com.nexus.backend.ai.dto.TranslationResponse;

public interface TranslationService {
    TranslationResponse translateText(TranslationRequest request);
}
