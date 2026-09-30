package com.hasmirhotels.repository;

import com.hasmirhotels.entity.Invoice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface InvoiceRepository extends JpaRepository<Invoice, Long> {
    List<Invoice> findByStatus(String status);
    Optional<Invoice> findByInvoiceNumber(String invoiceNumber);
    long countByStatus(String status);

    @Query("SELECT COALESCE(SUM(i.totalAmount), 0) FROM Invoice i WHERE i.status = 'PAID'")
    Double getTotalPaidRevenue();
}
