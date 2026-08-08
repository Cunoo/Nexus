package com.nexus.backend.ai.controller;
import com.nexus.backend.ai.dto.TranslationResponse;
import com.nexus.backend.ai.dto.TranslationRequest;
import com.nexus.backend.ai.service.TranslationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@RestController
@RequestMapping("user/translation")
@RequiredArgsConstructor
public class TranslationController {
    private final TranslationService translationService;

    @PostMapping
    public ResponseEntity<TranslationResponse> translate(@Valid @RequestBody TranslationRequest request) {
        TranslationResponse response = translationService.translateText(request);
        return ResponseEntity.ok(response);
    }
}
