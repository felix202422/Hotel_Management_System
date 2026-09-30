package com.fizzohotels.controller;

import com.fizzohotels.dto.ApiResponse;
import com.fizzohotels.entity.Invoice;
import com.fizzohotels.repository.InvoiceRepository;
import org.springframework.data.domain.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/invoices")
public class InvoiceController {

    private final InvoiceRepository repository;

    public InvoiceController(InvoiceRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<Invoice>>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "invoiceId") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<Invoice> result = repository.findAll(pageable);
        return ResponseEntity.ok(ApiResponse.success("Invoices retrieved", result));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Invoice>> getById(@PathVariable Long id) {
        Invoice invoice = repository.findById(id).orElse(null);
        if (invoice == null) {
            return ResponseEntity.ok(ApiResponse.error("Invoice not found"));
        }
        return ResponseEntity.ok(ApiResponse.success("Invoice found", invoice));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Invoice>> create(@RequestBody Invoice invoice) {
        if (invoice.getInvoiceNumber() == null || invoice.getInvoiceNumber().isEmpty()) {
            invoice.setInvoiceNumber(generateInvoiceNumber());
        }
        if (invoice.getInvoiceDate() == null) {
            invoice.setInvoiceDate(LocalDate.now());
        }
        if (invoice.getStatus() == null) {
            invoice.setStatus("PENDING");
        }
        if (invoice.getTax() == null) {
            invoice.setTax(0.0);
        }
        if (invoice.getAmount() != null) {
            invoice.setTotalAmount(invoice.getAmount() + invoice.getTax());
        }
        Invoice saved = repository.save(invoice);
        return ResponseEntity.ok(ApiResponse.success("Invoice created", saved));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Invoice>> update(@PathVariable Long id, @RequestBody Invoice invoice) {
        Invoice existing = repository.findById(id).orElse(null);
        if (existing == null) {
            return ResponseEntity.ok(ApiResponse.error("Invoice not found"));
        }
        if (invoice.getReservation() != null) existing.setReservation(invoice.getReservation());
        if (invoice.getInvoiceNumber() != null) existing.setInvoiceNumber(invoice.getInvoiceNumber());
        if (invoice.getAmount() != null) existing.setAmount(invoice.getAmount());
        if (invoice.getTax() != null) existing.setTax(invoice.getTax());
        if (invoice.getStatus() != null) existing.setStatus(invoice.getStatus());
        if (invoice.getInvoiceDate() != null) existing.setInvoiceDate(invoice.getInvoiceDate());
        if (invoice.getDueDate() != null) existing.setDueDate(invoice.getDueDate());
        if (invoice.getNotes() != null) existing.setNotes(invoice.getNotes());
        if (existing.getAmount() != null && existing.getTax() != null) {
            existing.setTotalAmount(existing.getAmount() + existing.getTax());
        }
        Invoice saved = repository.save(existing);
        return ResponseEntity.ok(ApiResponse.success("Invoice updated", saved));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        if (!repository.existsById(id)) {
            return ResponseEntity.ok(ApiResponse.error("Invoice not found"));
        }
        repository.deleteById(id);
        return ResponseEntity.ok(ApiResponse.success("Invoice deleted", null));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<ApiResponse<List<Invoice>>> getByStatus(@PathVariable String status) {
        List<Invoice> invoices = repository.findByStatus(status);
        return ResponseEntity.ok(ApiResponse.success("Invoices by status", invoices));
    }

    private String generateInvoiceNumber() {
        long count = repository.count();
        return String.format("INV-%04d", count + 1);
    }
}
