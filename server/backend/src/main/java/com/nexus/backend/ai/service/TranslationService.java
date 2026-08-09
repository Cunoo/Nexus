package com.nexus.backend.ai.service;

import com.nexus.backend.ai.dto.TranslationRequest;
import com.nexus.backend.ai.dto.TranslationResponse;
import com.nexus.backend.user.entity.User;

public interface TranslationService {
    TranslationResponse translateText(TranslationRequest request, Long userId);
}
