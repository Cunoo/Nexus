package com.nexus.backend.ai.repository;

import com.nexus.backend.ai.entity.Paraphrase;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ParaphraseRepository extends JpaRepository<Paraphrase, Long> {

    Optional<Paraphrase> findFirstByTextHashAndToneAndLanguage(String textHash, String tone, String language);
}