package com.fizzohotels.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "invoices")
public class Invoice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long invoiceId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reservation_id")
    private Reservation reservation;

    private String invoiceNumber;

    private Double amount;

    private Double tax = 0.0;

    private Double totalAmount;

    private String status = "PENDING";

    private LocalDate invoiceDate;

    private LocalDate dueDate;

    private String notes;
}
