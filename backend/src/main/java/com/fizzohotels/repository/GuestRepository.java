package com.fizzohotels.repository;

import com.fizzohotels.entity.Guest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GuestRepository extends JpaRepository<Guest, Long> {
    Page<Guest> findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCaseOrEmailContainingIgnoreCase(String first, String last, String email, Pageable pageable);
    Page<Guest> findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(String first, String last, Pageable pageable);
}
