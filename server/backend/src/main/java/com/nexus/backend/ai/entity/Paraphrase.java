package com.nexus.backend.ai.entity;

import com.nexus.backend.user.entity.User;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.OffsetDateTime;

@Entity
@Table(name = "paraphrases", indexes = {
        @Index(name = "idx_paraphrases_hash_tone_lang", columnList = "text_hash, tone, language")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Paraphrase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = true)
    private User user;

    @Column(name = "input_text", nullable = false, columnDefinition = "TEXT")
    private String inputText;

    @Column(name = "paraphrased_text", nullable = false, columnDefinition = "TEXT")
    private String paraphrasedText;

    @Column(name = "text_hash", nullable = false, length = 64)
    private String textHash;

    @Builder.Default
    @Column(name = "tone", length = 30)
    private String tone = "standard";

    @Builder.Default
    @Column(name = "language", length = 10)
    private String language = "en";

    @Column(name = "character_count", nullable = false)
    private Integer characterCount;

    @Column(name = "prompt_tokens")
    private Integer promptTokens;

    @Column(name = "completion_tokens")
    private Integer completionTokens;

    @Column(name = "latency_ms")
    private Long latencyMs;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private OffsetDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private OffsetDateTime updatedAt;
}