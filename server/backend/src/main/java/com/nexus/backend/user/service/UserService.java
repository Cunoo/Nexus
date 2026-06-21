package com.nexus.backend.user.service;

import com.nexus.backend.user.dto.UserRequest;
import com.nexus.backend.user.dto.UserResponse;
import com.nexus.backend.user.entity.User;
public interface UserService {

    UserResponse createUser(UserRequest userRequest);

    User findByUsername(String username);

    //User findByEmail(String Email);

    //void deleteUser(Long id);

}
