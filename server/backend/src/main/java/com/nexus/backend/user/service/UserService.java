package com.nexus.backend.user.service;

import com.nexus.backend.user.dto.AuthResponse;
import com.nexus.backend.user.dto.LoginRequest;
import com.nexus.backend.user.dto.UserRequest;
import com.nexus.backend.user.dto.UserResponse;
import com.nexus.backend.user.entity.User;
public interface UserService {

    AuthResponse createUser(UserRequest userRequest);
    AuthResponse login(LoginRequest loginRequest);

    User findByUsername(String username);

    //User findByEmail(String Email);

    //void deleteUser(Long id);

}
