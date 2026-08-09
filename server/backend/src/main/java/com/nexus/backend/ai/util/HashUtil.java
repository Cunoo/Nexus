package com.nexus.backend.ai.util;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.HexFormat;

public class HashUtil {

    private HashUtil() {
        // Private constructor to prevent instantiation (Utility class)
    }

    /**
     * Calculates the SHA-256 hash of the input text.
     *
     * @param input Input text to hash
     * @return 64-character hexadecimal string (SHA-256 hash)
     */
    public static String applySha256(String input) {
        if (input == null) {
            return null;
        }
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hashBytes = digest.digest(input.getBytes(StandardCharsets.UTF_8));

            return HexFormat.of().formatHex(hashBytes);
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("SHA-256 algorithm was not found in JRE", e);
        }
    }
}