package com.fizzohotels.repository;

import com.fizzohotels.entity.AuditLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {
    List<AuditLog> findByUserIdOrderByTimestampDesc(String userId);
    List<AuditLog> findByActionOrderByTimestampDesc(String action);
    Page<AuditLog> findAllByOrderByTimestampDesc(Pageable pageable);
}
