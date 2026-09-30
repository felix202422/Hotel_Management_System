package com.fizzohotels.repository;

import com.fizzohotels.entity.MaintenanceRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MaintenanceRequestRepository extends JpaRepository<MaintenanceRequest, Long> {
    List<MaintenanceRequest> findByStatus(String status);
    List<MaintenanceRequest> findByAssignedTo(String assignedTo);
    long countByStatus(String status);
    long countByPriority(String priority);
    Page<MaintenanceRequest> findByDescriptionContainingIgnoreCase(String desc, Pageable pageable);
}
