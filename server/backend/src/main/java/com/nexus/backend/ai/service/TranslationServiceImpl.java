package com.nexus.backend.ai.service;

import com.nexus.backend.ai.dto.TranslationResponse;
import com.nexus.backend.ai.dto.TranslationRequest;
import com.nexus.backend.ai.entity.Translation;
import com.nexus.backend.ai.repository.TranslationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.ai.chat.model.ChatResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.ai.chat.client.ChatClient;
import com.nexus.backend.ai.util.HashUtil;

import java.time.OffsetDateTime;
import java.util.Optional;


@RequiredArgsConstructor
@Service
public class TranslationServiceImpl implements TranslationService {
    private final ChatClient chatClient;
    private final TranslationRepository translationRepository;
    private final AsyncTranslationSaver asyncTranslationSaver;

    @Value("${spring.ai.openai.chat.options.model}")
    private String defaultModel;
    @Override
    public TranslationResponse translateText(TranslationRequest request, Long userId) {
        String textHash = HashUtil.applySha256(request.text());

        // 1. GLOBAL CACHE LOOKUP
        Optional<Translation> cached = translationRepository
                .findFirstByTextHashAndTargetLang(textHash, request.targetLang());

        if (cached.isPresent()) {
            Translation cacheEntry = cached.get();

            // Update hit count & timestamp asynchronously without re-saving entity relationships
            asyncTranslationSaver.updateCacheHitStatsAsync(cacheEntry.getId(), OffsetDateTime.now());

            // Return cache hit response
            return new TranslationResponse(
                    cacheEntry.getId(),
                    cacheEntry.getSourceLang(),
                    cacheEntry.getTargetLang(),
                    cacheEntry.getInputText(),
                    cacheEntry.getTranslatedText(),
                    true, // cached = true
                    cacheEntry.getModelUsed(),
                    cacheEntry.getLatencyMs(),
                    cacheEntry.getIsFavorite(),
                    cacheEntry.getCreatedAt()
            );
        }

        // 2. CACHE MISS: Execute AI Translation via ChatClient
        long startTime = System.currentTimeMillis();

        ChatResponse response = chatClient.prompt()
                .system("""
                You are a professional language translator.
                Translate the input text accurately into the requested target language.
                Do not include conversational filler, extra commentary, or quotes.
                Provide ONLY the translated text.
            """)
                .user(userSpec -> userSpec
                        .text("Translate from {sourceLang} to {targetLang}:\n\n{text}")
                        .param("sourceLang", request.sourceLang())
                        .param("targetLang", request.targetLang())
                        .param("text", request.text())
                )
                .call()
                .chatResponse();

        long latencyMs = System.currentTimeMillis() - startTime;

        // 3. EXTRACT AI METADATA
        assert response != null;
        String translatedText = response.getResult().getOutput().getText();

        if (translatedText != null) {
            translatedText = translatedText.replaceAll("(?i)User Safety:\\s*\\w+", "").trim();
        }

        Integer promptTokens = null;
        Integer completionTokens = null;
        String modelUsed = defaultModel;
        if (response.getMetadata() != null) {
            // Dynamically retrieve actual model name returned by OpenRouter
            if (response.getMetadata().getModel() != null && !response.getMetadata().getModel().isBlank()) {
                modelUsed = response.getMetadata().getModel();
            }

            if (response.getMetadata().getUsage() != null) {
                promptTokens = response.getMetadata().getUsage().getPromptTokens().intValue();
                completionTokens = response.getMetadata().getUsage().getCompletionTokens().intValue();
            }
        }

        // 4. BUILD & ASYNC SAVE NEW TRANSLATION
        Translation newTranslation = Translation.builder()
                // Do not attach 'user' here to prevent detached entity persistence issues
                .sourceLang(request.sourceLang())
                .targetLang(request.targetLang())
                .inputText(request.text())
                .textHash(textHash)
                .translatedText(translatedText)
                .characterCount(request.text().length())
                .modelUsed(modelUsed)
                .promptTokens(promptTokens)
                .completionTokens(completionTokens)
                .latencyMs(latencyMs)
                .hitCount(1)
                .isFavorite(false)
                .build();

        // Pass the user ID explicitly to the async task
        asyncTranslationSaver.saveTranslationAsync(newTranslation, userId != null ? userId : null);

        // 5. RETURN FRESH RESPONSE
        return new TranslationResponse(
                null, // ID generated during async DB insertion
                newTranslation.getSourceLang(),
                newTranslation.getTargetLang(),
                newTranslation.getInputText(),
                newTranslation.getTranslatedText(),
                false, // cached = false
                newTranslation.getModelUsed(),
                latencyMs,
                false,
                OffsetDateTime.now()
        );
    }
}
