package com.nexus.backend.user.dto;

import com.nexus.backend.user.enums.UserRole;
public record UserRequest(
        Long id,
        String username,
        String password,
        String email
) {}