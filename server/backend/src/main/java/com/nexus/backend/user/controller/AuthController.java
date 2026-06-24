
package com.nexus.backend.user.controller;

import com.nexus.backend.user.dto.LoginRequest;
import com.nexus.backend.user.dto.UserRequest;
import com.nexus.backend.user.dto.UserResponse;
import com.nexus.backend.user.service.UserService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {
    private final UserService userService;


    public AuthController(UserService userService) {
        this.userService = userService;
    }


    @PostMapping("/register")
    public UserResponse register(@RequestBody UserRequest request) {
        return userService.createUser(request);
    }

    @PostMapping("/login")
    public UserResponse login(@RequestBody LoginRequest request) {
        return userService.login(request);
    }
}