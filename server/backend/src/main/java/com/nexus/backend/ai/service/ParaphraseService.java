package com.nexus.backend.ai.service;

import com.nexus.backend.ai.dto.ParaphraseRequest;
import com.nexus.backend.ai.dto.ParaphraseResponse;
import com.nexus.backend.user.entity.User;

public interface ParaphraseService {
    public ParaphraseResponse paraphraseText(ParaphraseRequest request, Long userId);
}