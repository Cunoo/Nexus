package com.nexus.backend.ai.service;

import com.nexus.backend.ai.entity.Translation;
import com.nexus.backend.ai.repository.TranslationRepository;
import com.nexus.backend.user.entity.User;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;

@Slf4j
@Service
@RequiredArgsConstructor
public class AsyncTranslationSaver {

    private final TranslationRepository translationRepository;

    @PersistenceContext
    private final EntityManager entityManager;

    @Async("translationTaskExecutor")
    @Transactional
    public void saveTranslationAsync(Translation translation, Long userId) {
        try {
            if (userId != null) {
                // Attach a proxy User reference to the current thread's EntityManager
                User userRef = entityManager.getReference(User.class, userId);
                translation.setUser(userRef);
            }

            translationRepository.save(translation);
        } catch (Exception e) {
            log.error("Failed to asynchronously save translation for user ID: {}", userId, e);
        }
    }

    @Async("translationTaskExecutor")
    public void updateCacheHitStatsAsync(Long translationId, OffsetDateTime now) {
        try {
            translationRepository.updateCacheHitStats(translationId, now);
        } catch (Exception e) {
            log.error("Failed to update cache hit stats for translation ID: {}", translationId, e);
        }
    }
}