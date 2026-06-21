package com.nexus.backend.user.enums;

public enum UserRole {
    ADMIN("ADMIN"),
    USER("USER");

    private final String role;

    UserRole(String role){
        this.role = role;
    }
    public String getValue() {
        return role;
    }
}
