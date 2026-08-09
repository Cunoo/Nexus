package com.nexus.backend.ai.repository;

import com.nexus.backend.ai.entity.Translation;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.OffsetDateTime;
import java.util.Optional;

@Repository
public interface TranslationRepository extends JpaRepository<Translation, Long> {

    // =========================================================================
    // 1. CACHE LOOKUP METHODS
    // =========================================================================

    /**
     * GLOBAL CACHE LOOKUP (Recommended for Production)
     * Finds any existing translation matching the text hash and target language across ALL users.
     * Reuses previous translations to eliminate OpenRouter API costs.
     */
    Optional<Translation> findFirstByTextHashAndTargetLang(String textHash, String targetLang);

    /**
     * PER-USER CACHE LOOKUP (Alternative for strict isolation)
     * Finds an existing translation matching the text hash and target language for a SPECIFIC user.
     */
    Optional<Translation> findByUserIdAndTextHashAndTargetLang(Long userId, String textHash, String targetLang);


    // =========================================================================
    // 2. USER HISTORY & FAVORITES (Paginated for performance)
    // =========================================================================

    /**
     * Retrieves paginated translation history for a specific user, newest first.
     */
    Page<Translation> findByUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);

    /**
     * Retrieves paginated favorite translations for a specific user.
     */
    Page<Translation> findByUserIdAndIsFavoriteTrueOrderByCreatedAtDesc(Long userId, Pageable pageable);


    // =========================================================================
    // 3. HELPER CHECKS
    // =========================================================================

    /**
     * Quick check to see if a translation already exists globally without loading the full entity.
     */
    boolean existsByTextHashAndTargetLang(String textHash, String targetLang);

    @Modifying
    @Transactional
    @Query("UPDATE Translation t SET t.hitCount = t.hitCount + 1, t.lastAccessedAt = :now WHERE t.id = :id")
    void updateCacheHitStats(@Param("id") Long id, @Param("now") OffsetDateTime now);
}