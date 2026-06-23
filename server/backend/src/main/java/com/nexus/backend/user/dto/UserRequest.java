package com.nexus.backend.user.dto;

import com.nexus.backend.user.enums.UserRole;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record UserRequest(
        Long id,

        @NotBlank
        String username,
        String password,

        @NotBlank
        @Email
        String email
) {}