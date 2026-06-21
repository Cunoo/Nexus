package com.nexus.backend.user.repository;

import com.nexus.backend.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;


public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);


    boolean existsByEmail(String email);
    boolean existsByUsername(String username);
}
