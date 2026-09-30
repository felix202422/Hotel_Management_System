package com.fizzohotels.repository;

import com.fizzohotels.entity.GuestUser;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface GuestUserRepository extends JpaRepository<GuestUser, Long> {
    Optional<GuestUser> findByUsername(String username);
    Optional<GuestUser> findByEmail(String email);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
}
