package com.nexus.backend.user.dto;

public record UserResponse(
        Long id,
        String username,
        String email
) {}