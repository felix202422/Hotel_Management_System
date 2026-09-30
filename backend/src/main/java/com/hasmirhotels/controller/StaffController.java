package com.hasmirhotels.controller;

import com.hasmirhotels.dto.ApiResponse;
import com.hasmirhotels.entity.Admin;
import com.hasmirhotels.exception.ResourceNotFoundException;
import com.hasmirhotels.repository.AdminRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/staff")
public class StaffController {

    private final AdminRepository adminRepository;

    public StaffController(AdminRepository adminRepository) {
        this.adminRepository = adminRepository;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Admin>>> getAllStaff(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "100") int size,
            @RequestParam(required = false) String search) {
        List<Admin> staff = adminRepository.findAll().stream()
                .filter(a -> !"ADMIN".equals(a.getRole()))
                .collect(Collectors.toList());
        if (search != null && !search.isEmpty()) {
            String searchLower = search.toLowerCase();
            staff = staff.stream()
                    .filter(a -> (a.getFullName() != null && a.getFullName().toLowerCase().contains(searchLower))
                            || (a.getEmail() != null && a.getEmail().toLowerCase().contains(searchLower))
                            || (a.getDepartment() != null && a.getDepartment().toLowerCase().contains(searchLower))
                            || (a.getPosition() != null && a.getPosition().toLowerCase().contains(searchLower)))
                    .collect(Collectors.toList());
        }
        return ResponseEntity.ok(ApiResponse.success("Staff retrieved", staff));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Admin>> getStaffById(@PathVariable Long id) {
        Admin staff = adminRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Staff not found with id: " + id));
        if ("ADMIN".equals(staff.getRole())) {
            throw new ResourceNotFoundException("Staff not found with id: " + id);
        }
        return ResponseEntity.ok(ApiResponse.success("Staff retrieved", staff));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Admin>> createStaff(@RequestBody Admin staff) {
        staff.setRole(staff.getRole() != null ? staff.getRole() : "STAFF");
        if (staff.getStatus() == null) {
            staff.setStatus("Active");
        }
        Admin saved = adminRepository.save(staff);
        return ResponseEntity.ok(ApiResponse.success("Staff created successfully", saved));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Admin>> updateStaff(@PathVariable Long id, @RequestBody Admin staffDetails) {
        Admin existing = adminRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Staff not found with id: " + id));
        existing.setFullName(staffDetails.getFullName());
        existing.setEmail(staffDetails.getEmail());
        existing.setPhone(staffDetails.getPhone());
        existing.setDepartment(staffDetails.getDepartment());
        existing.setPosition(staffDetails.getPosition());
        if (staffDetails.getPassword() != null && !staffDetails.getPassword().isEmpty()) {
            existing.setPassword(staffDetails.getPassword());
        }
        if (staffDetails.getProfilePhoto() != null) {
            existing.setProfilePhoto(staffDetails.getProfilePhoto());
        }
        Admin saved = adminRepository.save(existing);
        return ResponseEntity.ok(ApiResponse.success("Staff updated successfully", saved));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteStaff(@PathVariable Long id) {
        Admin staff = adminRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Staff not found with id: " + id));
        if ("ADMIN".equals(staff.getRole())) {
            throw new ResourceNotFoundException("Cannot delete admin user");
        }
        adminRepository.deleteById(id);
        return ResponseEntity.ok(ApiResponse.success("Staff deleted successfully", null));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<ApiResponse<Admin>> toggleStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        Admin staff = adminRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Staff not found with id: " + id));
        String status = body.get("status");
        if (status == null || (!status.equals("Active") && !status.equals("Inactive"))) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Status must be 'Active' or 'Inactive'"));
        }
        staff.setStatus(status);
        Admin saved = adminRepository.save(staff);
        return ResponseEntity.ok(ApiResponse.success("Staff status updated successfully", saved));
    }
}
