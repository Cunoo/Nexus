package com.nexus.backend.ai.service;

import com.nexus.backend.ai.dto.TranslationResponse;
import com.nexus.backend.ai.dto.TranslationRequest;
import com.nexus.backend.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@RequiredArgsConstructor
@Service
public class TranslationServiceImpl implements TranslationService {
    private final ChatClient chatClient;

    public TranslationResponse translateText(TranslationRequest request) {
        return chatClient.prompt()
                .system("""
                    You are a professional language translator.
                    Translate the input text accurately into the requested target language.
                    Detect the source language automatically.
                    Do not include conversational filler or extra commentary.
                """)
                .user(userSpec -> userSpec
                        .text("Translate to {targetLanguage}:\n\n{text}")
                        .param("targetLanguage", request.targetLang())
                        .param("text", request.text())
                )
                .call()
                .entity(TranslationResponse.class);
    }
}
