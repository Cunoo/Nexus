package com.nexus.backend.ai.service;

import com.nexus.backend.ai.dto.ParaphraseRequest;
import com.nexus.backend.ai.dto.ParaphraseResponse;
import com.nexus.backend.ai.entity.Paraphrase;
import com.nexus.backend.ai.repository.ParaphraseRepository;
import com.nexus.backend.ai.util.HashUtil;
import com.nexus.backend.user.entity.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.model.ChatModel;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.ai.chat.prompt.PromptTemplate;
import org.springframework.stereotype.Service;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class ParaphraseServiceImpl implements ParaphraseService {

    private final ChatModel chatModel;
    private final AsyncParaphraseSaver asyncParaphraseSaver;
    private final ParaphraseRepository paraphraseRepository;

    private static final String PARAPHRASE_SYSTEM_PROMPT = """
        You are an expert editor and rewriter. Your task is to paraphrase the provided text.
        
        Instructions:
        1. Rewrite the text while preserving its original meaning.
        2. Apply the requested tone: {tone}.
        3. Language handling:
           - If language is 'auto' or empty, automatically detect the language of the input text and write the output in the SAME language.
           - Otherwise, ensure the output is in the specified language code: {language}.
        4. Do NOT include any explanations, safety warnings, or meta-commentary (e.g., do not write 'Here is your text' or 'User Safety: safe').
        5. Return ONLY the rewritten text.
        
        Text to paraphrase:
        {text}
        """;

    @Override
    public ParaphraseResponse paraphraseText(ParaphraseRequest request, Long userId) {
        String textHash = HashUtil.applySha256(request.text());
        String tone = (request.tone() != null && !request.tone().isBlank()) ? request.tone() : "standard";
        String language = (request.language() != null && !request.language().isBlank()) ? request.language() : "auto";

        // 1. CHECKING THE DATABASE CACHE
        var cached = paraphraseRepository.findFirstByTextHashAndToneAndLanguage(textHash, tone, language);
        if (cached.isPresent()) {
            log.info("Paraphrase cache hit for hash: {}", textHash);
            return new ParaphraseResponse(
                    request.text(),
                    cached.get().getParaphrasedText(),
                    tone,
                    language
            );
        }

        //2. If it's not in the cache, we'll call the LLM...
        long startTime = System.currentTimeMillis();
        PromptTemplate promptTemplate = new PromptTemplate(PARAPHRASE_SYSTEM_PROMPT);
        Prompt prompt = promptTemplate.create(Map.of(
                "text", request.text(),
                "tone", tone,
                "language", language
        ));

        String rawResult = chatModel.call(prompt).getResult().getOutput().getText();
        String cleanedText = sanitizeOutput(rawResult);

        long latencyMs = System.currentTimeMillis() - startTime;

        Paraphrase paraphrase = Paraphrase.builder()
                .inputText(request.text())
                .paraphrasedText(cleanedText)
                .textHash(textHash)
                .tone(tone)
                .language(language)
                .characterCount(request.text().length())
                .latencyMs(latencyMs)
                .build();

        asyncParaphraseSaver.saveParaphraseAsync(paraphrase, userId);

        return new ParaphraseResponse(
                request.text(),
                cleanedText,
                tone,
                language
        );
    }

    private String sanitizeOutput(String input) {
        if (input == null) return "";
        return input.replaceAll("(?i)User Safety:\\s*\\w+", "").trim();
    }
}