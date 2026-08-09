package com.nexus.backend.ai.controller;

import com.nexus.backend.ai.dto.ParaphraseRequest;
import com.nexus.backend.ai.dto.ParaphraseResponse;
import com.nexus.backend.ai.service.ParaphraseService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user/api/paraphrase")
@RequiredArgsConstructor
public class ParaphraseController {

    private final ParaphraseService paraphraseService;

    @PostMapping
    public ResponseEntity<ParaphraseResponse> paraphrase(
            @Valid @RequestBody ParaphraseRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {

        Long userId = null;
        if (userDetails != null) {
            userId = Long.parseLong(userDetails.getUsername());
        }

        ParaphraseResponse response = paraphraseService.paraphraseText(request, userId);
        return ResponseEntity.ok(response);
    }
}