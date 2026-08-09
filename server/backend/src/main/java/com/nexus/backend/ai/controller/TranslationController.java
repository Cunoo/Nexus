package com.nexus.backend.ai.controller;
import com.nexus.backend.ai.dto.TranslationResponse;
import com.nexus.backend.ai.dto.TranslationRequest;
import com.nexus.backend.ai.service.TranslationService;
import com.nexus.backend.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

@RestController
@RequestMapping("user/api/translation")
@RequiredArgsConstructor
public class TranslationController {

    private final TranslationService translationService;

    @PostMapping
    public ResponseEntity<TranslationResponse> translate(
            @AuthenticationPrincipal User currentUser,
            @Valid @RequestBody TranslationRequest request) {

        TranslationResponse response = translationService.translateText(currentUser, request);
        return ResponseEntity.ok(response);
    }
}
