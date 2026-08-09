package com.nexus.backend.ai.service;

import com.nexus.backend.ai.entity.Paraphrase;
import com.nexus.backend.ai.repository.ParaphraseRepository;
import com.nexus.backend.user.entity.User;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class AsyncParaphraseSaver {

    private final ParaphraseRepository paraphraseRepository;

    @PersistenceContext
    private final EntityManager entityManager;

    @Async("translationTaskExecutor")
    @Transactional
    public void saveParaphraseAsync(Paraphrase paraphrase, Long userId) {
        try {
            if (userId != null) {
                User userRef = entityManager.getReference(User.class, userId);
                paraphrase.setUser(userRef);
            }

            paraphraseRepository.save(paraphrase);
        } catch (Exception e) {
            log.error("Failed to asynchronously save paraphrase for user ID: {}", userId, e);
        }
    }
}