package com.hasmirhotels.controller;

import com.hasmirhotels.dto.ApiResponse;
import com.hasmirhotels.dto.AuthResponse;
import com.hasmirhotels.dto.LoginRequest;
import com.hasmirhotels.entity.GuestUser;
import com.hasmirhotels.repository.GuestUserRepository;
import com.hasmirhotels.security.JwtUtil;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/guest-auth")
public class GuestAuthController {

    private final GuestUserRepository guestUserRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public GuestAuthController(GuestUserRepository guestUserRepository,
                                PasswordEncoder passwordEncoder,
                                JwtUtil jwtUtil) {
        this.guestUserRepository = guestUserRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> request) {
        String firstName = request.get("firstName");
        String lastName = request.get("lastName");
        String email = request.get("email");
        String phone = request.get("phone");
        String password = request.get("password");

        if (firstName == null || lastName == null || email == null || password == null) {
            return ResponseEntity.badRequest().body(ApiResponse.error("firstName, lastName, email, and password are required"));
        }

        if (guestUserRepository.existsByEmail(email)) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Email already registered"));
        }

        String username = email;
        if (guestUserRepository.existsByUsername(username)) {
            return ResponseEntity.badRequest().body(ApiResponse.error("A user with this email already exists"));
        }

        GuestUser guestUser = new GuestUser();
        guestUser.setFullName(firstName + " " + lastName);
        guestUser.setEmail(email);
        guestUser.setUsername(username);
        guestUser.setPassword(passwordEncoder.encode(password));
        guestUser.setPhone(phone);
        guestUser.setRole("GUEST");
        guestUser.setStatus("Active");
        guestUserRepository.save(guestUser);

        String token = jwtUtil.generateToken(guestUser.getUsername(), guestUser.getId(), guestUser.getRole());
        AuthResponse authResponse = buildAuthResponse(token, guestUser, "Guest registered successfully");
        return ResponseEntity.ok(ApiResponse.success("Guest registered successfully", authResponse));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        GuestUser guestUser = guestUserRepository.findByUsername(request.getUsername()).orElse(null);
        if (guestUser == null || !passwordEncoder.matches(request.getPassword(), guestUser.getPassword())) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Invalid username or password"));
        }
        String token = jwtUtil.generateToken(guestUser.getUsername(), guestUser.getId(), guestUser.getRole());
        AuthResponse authResponse = buildAuthResponse(token, guestUser, "Login successful");
        return ResponseEntity.ok(ApiResponse.success("Login successful", authResponse));
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentGuest() {
        String username = getCurrentUsername();
        if (username == null) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Not authenticated"));
        }
        GuestUser guestUser = guestUserRepository.findByUsername(username).orElse(null);
        if (guestUser == null) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Guest not found"));
        }
        AuthResponse authResponse = buildAuthResponse(null, guestUser, "Guest found");
        return ResponseEntity.ok(ApiResponse.success("Guest found", authResponse));
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(@RequestBody Map<String, String> updates) {
        String username = getCurrentUsername();
        if (username == null) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Not authenticated"));
        }
        GuestUser guestUser = guestUserRepository.findByUsername(username).orElse(null);
        if (guestUser == null) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Guest not found"));
        }
        if (updates.containsKey("fullName")) {
            guestUser.setFullName(updates.get("fullName"));
        }
        if (updates.containsKey("phone")) {
            guestUser.setPhone(updates.get("phone"));
        }
        if (updates.containsKey("password") && updates.get("password") != null && !updates.get("password").isEmpty()) {
            guestUser.setPassword(passwordEncoder.encode(updates.get("password")));
        }
        guestUserRepository.save(guestUser);
        AuthResponse authResponse = buildAuthResponse(null, guestUser, "Profile updated successfully");
        return ResponseEntity.ok(ApiResponse.success("Profile updated successfully", authResponse));
    }

    private AuthResponse buildAuthResponse(String token, GuestUser guestUser, String message) {
        AuthResponse response = new AuthResponse();
        response.setToken(token);
        response.setId(guestUser.getId());
        response.setUsername(guestUser.getUsername());
        response.setFullName(guestUser.getFullName());
        response.setEmail(guestUser.getEmail());
        response.setRole(guestUser.getRole());
        response.setDepartment(null);
        response.setPosition(null);
        response.setStatus(guestUser.getStatus());
        response.setMessage(message);
        return response;
    }

    private String getCurrentUsername() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated() && auth.getPrincipal() instanceof String) {
            return (String) auth.getPrincipal();
        }
        return null;
    }
}
