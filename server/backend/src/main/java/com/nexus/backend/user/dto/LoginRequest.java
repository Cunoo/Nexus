package com.nexus.backend.user.dto;

public record LoginRequest(
    String username,
    String password
    ) {}
