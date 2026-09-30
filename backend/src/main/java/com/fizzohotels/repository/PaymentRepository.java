package com.fizzohotels.repository;

import com.fizzohotels.entity.Payment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;
import java.util.Optional;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
    @Query("SELECT SUM(p.amount) FROM Payment p WHERE p.paymentStatus = ?1")
    Optional<Double> sumByPaymentStatus(String status);
    long countByPaymentStatus(String status);
    Page<Payment> findByPaymentStatusContainingIgnoreCase(String status, Pageable pageable);
    @Query("SELECT COALESCE(SUM(p.amount), 0) FROM Payment p WHERE p.paymentStatus = 'Paid'")
    Double getTotalRevenue();
    @Query("SELECT p.paymentMethod, COUNT(p) FROM Payment p GROUP BY p.paymentMethod")
    List<Object[]> countByPaymentMethod();
}
