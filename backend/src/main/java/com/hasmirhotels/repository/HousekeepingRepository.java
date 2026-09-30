package com.hasmirhotels.repository;

import com.hasmirhotels.entity.Housekeeping;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface HousekeepingRepository extends JpaRepository<Housekeeping, Long> {
    long countByCleaningStatus(String status);
    List<Housekeeping> findByCleaningStatus(String status);
    Page<Housekeeping> findByAssignedStaffContainingIgnoreCase(String staff, Pageable pageable);
}
