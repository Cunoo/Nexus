package com.nexus.backend.ai.repository;

import com.nexus.backend.ai.entity.Translation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TranslationRepository extends JpaRepository<Translation, Long> {

    List<Translation> findByUserIdOrderByCreatedAtDesc(Long userId);

    List<Translation> findByUserIdAndIsFavoriteTrue(Long userId);
}