package com.nexus.backend.ai.entity;

import com.nexus.backend.user.entity.User;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.OffsetDateTime;

@Entity
@Table(
        name = "translations",
        indexes = {
                @Index(name = "idx_translations_user_id", columnList = "user_id"),
                // Index for lightning-fast caching: text HASH + target language + user
                @Index(name = "idx_translations_cache_search", columnList = "user_id, text_hash, target_lang")
        }
)
@Getter
@Setter
@ToString(exclude = "user") // Prevents StackOverflowError during LAZY fetch
@EqualsAndHashCode(exclude = "user")
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Translation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "source_lang", nullable = false, length = 10)
    private String sourceLang;

    @Column(name = "target_lang", nullable = false, length = 10)
    private String targetLang;

    @Column(name = "input_text", nullable = false, columnDefinition = "TEXT")
    private String inputText;

    // SHA-256 hash of input_text for extremely fast indexing and caching
    @Column(name = "text_hash", nullable = false, length = 64)
    private String textHash;

    @Column(name = "translated_text", nullable = false, columnDefinition = "TEXT")
    private String translatedText;

    @Builder.Default
    @Column(name = "is_favorite", nullable = false)
    private Boolean isFavorite = false;

    @Column(name = "character_count", nullable = false)
    private Integer characterCount;

    // --- Performance and cost metadata ---
    @Column(name = "model_used", nullable = false)
    private String modelUsed;

    @Column(name = "prompt_tokens")
    private Integer promptTokens;

    @Column(name = "completion_tokens")
    private Integer completionTokens;

    @Column(name = "latency_ms")
    private Long latencyMs;

    // --- Caching metadata ---
    @Builder.Default
    @Column(name = "hit_count", nullable = false)
    private Integer hitCount = 1;

    @Column(name = "last_accessed_at")
    private OffsetDateTime lastAccessedAt;

    // --- Timestamps ---
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private OffsetDateTime updatedAt;

    @PrePersist
    @PreUpdate
    protected void updateLastAccessed() {
        if (this.lastAccessedAt == null) {
            this.lastAccessedAt = OffsetDateTime.now();
        }
    }
}