package com.nexus.backend.user.service;

import com.nexus.backend.user.dto.AuthResponse;
import com.nexus.backend.user.dto.LoginRequest;
import com.nexus.backend.user.dto.UserRequest;
import com.nexus.backend.user.dto.UserResponse;
import com.nexus.backend.user.entity.User;
import com.nexus.backend.user.enums.UserRole;
import com.nexus.backend.user.exception.BusinessException;
import com.nexus.backend.user.repository.UserRepository;
import com.nexus.backend.user.security.JwtService;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    public UserServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @Override
    public AuthResponse createUser(UserRequest userRequest){

        if (userRepository.existsByEmail(userRequest.email())) {
            throw BusinessException.conflict("Email already exists");
        }
        if (userRepository.existsByUsername(userRequest.username())) {
            throw BusinessException.conflict("User already exists");
        }

        User user = new User();
        user.setUsername(userRequest.username());
        user.setEmail(userRequest.email());
        user.setPassword(passwordEncoder.encode(userRequest.password()));
        user.setRole(UserRole.USER);

        User savedUser = userRepository.save(user);
        String token = jwtService.generateToken(savedUser.getId(), String.valueOf(savedUser.getRole()));

        return new AuthResponse(token);
//        return new UserResponse(
//                savedUser.getId(),
//                savedUser.getUsername(),
//                savedUser.getEmail()
//        );
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        User user = userRepository
                .findByUsername(request.username())
                .orElseThrow(() ->
                    new BusinessException(
                            HttpStatus.NOT_FOUND,
                            "User not found"
                    )
                );
        if(!passwordEncoder.matches(request.password(), user.getPassword())) {
            throw BusinessException.wrongPassword();
        }

        String token = jwtService.generateToken(user.getId(), String.valueOf(user.getRole()));

        return new AuthResponse(token);

//        return new UserResponse(
//                user.getId(),
//                user.getUsername(),
//                user.getEmail()
//        );

    }

    @Override
    public User findByUsername(String username){
        return userRepository.findByUsername(username)
                .orElseThrow(() ->
                        new UsernameNotFoundException("username has not been found!")
                );
    }

    //@Override
    //void deleteUser(Long id);
}
