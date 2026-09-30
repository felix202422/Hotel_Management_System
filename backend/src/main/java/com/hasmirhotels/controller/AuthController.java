package com.hasmirhotels.controller;

import com.hasmirhotels.dto.ApiResponse;
import com.hasmirhotels.dto.AuthResponse;
import com.hasmirhotels.dto.LoginRequest;
import com.hasmirhotels.dto.RegisterRequest;
import com.hasmirhotels.entity.Admin;
import com.hasmirhotels.repository.AdminRepository;
import com.hasmirhotels.security.JwtUtil;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthController(AdminRepository adminRepository, PasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
        this.adminRepository = adminRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        Admin admin = adminRepository.findByUsername(request.getUsername()).orElse(null);
        if (admin == null || !passwordEncoder.matches(request.getPassword(), admin.getPassword())) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Invalid username or password"));
        }
        String token = jwtUtil.generateToken(admin.getUsername(), admin.getId(), admin.getRole());
        AuthResponse authResponse = buildAuthResponse(token, admin, "Login successful");
        return ResponseEntity.ok(ApiResponse.success("Login successful", authResponse));
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser() {
        String username = getCurrentUsername();
        if (username == null) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Not authenticated"));
        }
        Admin admin = adminRepository.findByUsername(username).orElse(null);
        if (admin == null) {
            return ResponseEntity.badRequest().body(ApiResponse.error("User not found"));
        }
        AuthResponse authResponse = buildAuthResponse(null, admin, "User found");
        return ResponseEntity.ok(ApiResponse.success("User found", authResponse));
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        String username = getCurrentUsername();
        if (username == null || !hasAdminRole(username)) {
            return ResponseEntity.status(403).body(ApiResponse.error("Access denied. Admin role required."));
        }
        if (adminRepository.existsByUsername(request.getUsername())) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Username already exists"));
        }
        Admin admin = new Admin(
                request.getFullName(),
                request.getEmail(),
                passwordEncoder.encode(request.getPassword()),
                request.getUsername()
        );
        if (request.getRole() != null) {
            admin.setRole(request.getRole());
        }
        if (request.getDepartment() != null) {
            admin.setDepartment(request.getDepartment());
        }
        if (request.getPosition() != null) {
            admin.setPosition(request.getPosition());
        }
        adminRepository.save(admin);
        String token = jwtUtil.generateToken(admin.getUsername(), admin.getId(), admin.getRole());
        AuthResponse authResponse = buildAuthResponse(token, admin, "User registered successfully");
        return ResponseEntity.ok(ApiResponse.success("User registered successfully", authResponse));
    }

    @GetMapping("/users")
    public ResponseEntity<?> listUsers() {
        String username = getCurrentUsername();
        if (username == null || !hasAdminRole(username)) {
            return ResponseEntity.status(403).body(ApiResponse.error("Access denied. Admin role required."));
        }
        List<AuthResponse> users = adminRepository.findAll().stream()
                .map(admin -> buildAuthResponse(null, admin, null))
                .collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success("Users retrieved successfully", users));
    }

    @PutMapping("/users/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody Map<String, String> updates) {
        String username = getCurrentUsername();
        if (username == null || !hasAdminRole(username)) {
            return ResponseEntity.status(403).body(ApiResponse.error("Access denied. Admin role required."));
        }
        Admin admin = adminRepository.findById(id).orElse(null);
        if (admin == null) {
            return ResponseEntity.badRequest().body(ApiResponse.error("User not found"));
        }
        if (updates.containsKey("fullName")) {
            admin.setFullName(updates.get("fullName"));
        }
        if (updates.containsKey("email")) {
            admin.setEmail(updates.get("email"));
        }
        if (updates.containsKey("role")) {
            admin.setRole(updates.get("role"));
        }
        if (updates.containsKey("department")) {
            admin.setDepartment(updates.get("department"));
        }
        if (updates.containsKey("position")) {
            admin.setPosition(updates.get("position"));
        }
        if (updates.containsKey("phone")) {
            admin.setPhone(updates.get("phone"));
        }
        if (updates.containsKey("password") && updates.get("password") != null && !updates.get("password").isEmpty()) {
            admin.setPassword(passwordEncoder.encode(updates.get("password")));
        }
        adminRepository.save(admin);
        AuthResponse authResponse = buildAuthResponse(null, admin, "User updated successfully");
        return ResponseEntity.ok(ApiResponse.success("User updated successfully", authResponse));
    }

    @PutMapping("/users/{id}/status")
    public ResponseEntity<?> updateUserStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        String username = getCurrentUsername();
        if (username == null || !hasAdminRole(username)) {
            return ResponseEntity.status(403).body(ApiResponse.error("Access denied. Admin role required."));
        }
        Admin admin = adminRepository.findById(id).orElse(null);
        if (admin == null) {
            return ResponseEntity.badRequest().body(ApiResponse.error("User not found"));
        }
        String newStatus = body.get("status");
        if (newStatus == null || newStatus.isEmpty()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Status is required"));
        }
        admin.setStatus(newStatus);
        adminRepository.save(admin);
        AuthResponse authResponse = buildAuthResponse(null, admin, "User status updated successfully");
        return ResponseEntity.ok(ApiResponse.success("User status updated successfully", authResponse));
    }

    private AuthResponse buildAuthResponse(String token, Admin admin, String message) {
        AuthResponse response = new AuthResponse();
        response.setToken(token);
        response.setId(admin.getId());
        response.setUsername(admin.getUsername());
        response.setFullName(admin.getFullName());
        response.setEmail(admin.getEmail());
        response.setRole(admin.getRole());
        response.setDepartment(admin.getDepartment());
        response.setPosition(admin.getPosition());
        response.setStatus(admin.getStatus());
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

    private boolean hasAdminRole(String username) {
        Admin admin = adminRepository.findByUsername(username).orElse(null);
        return admin != null && "ADMIN".equals(admin.getRole());
    }
}
