package com.nexus.backend.ai.service;

import com.nexus.backend.ai.entity.Translation;
import com.nexus.backend.ai.repository.TranslationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class AsyncTranslationSaver {

    private final TranslationRepository translationRepository;

    @Async("translationTaskExecutor")
    public void saveTranslationAsync(Translation translation) {
        try {
            translationRepository.save(translation);
        } catch (Exception e) {
            log.error("Failed to asynchronously save translation for user ID: {}",
                    translation.getUser() != null ? translation.getUser().getId() : "unknown", e);
        }
    }
}