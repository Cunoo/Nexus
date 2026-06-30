package com.nexus.backend.user.dto;

public record ErrorResponse(
        String message,
        int status
) {}