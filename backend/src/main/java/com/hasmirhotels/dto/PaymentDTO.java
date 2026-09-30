package com.hasmirhotels.dto;

import java.time.LocalDate;

public class PaymentDTO {

    private Long paymentId;
    private Long reservationId;
    private String paymentMethod;
    private LocalDate paymentDate;
    private double amount;
    private String paymentStatus;

    public PaymentDTO() {
    }

    public PaymentDTO(Long paymentId, Long reservationId, String paymentMethod, LocalDate paymentDate, double amount, String paymentStatus) {
        this.paymentId = paymentId;
        this.reservationId = reservationId;
        this.paymentMethod = paymentMethod;
        this.paymentDate = paymentDate;
        this.amount = amount;
        this.paymentStatus = paymentStatus;
    }

    public Long getPaymentId() {
        return paymentId;
    }

    public void setPaymentId(Long paymentId) {
        this.paymentId = paymentId;
    }

    public Long getReservationId() {
        return reservationId;
    }

    public void setReservationId(Long reservationId) {
        this.reservationId = reservationId;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public LocalDate getPaymentDate() {
        return paymentDate;
    }

    public void setPaymentDate(LocalDate paymentDate) {
        this.paymentDate = paymentDate;
    }

    public double getAmount() {
        return amount;
    }

    public void setAmount(double amount) {
        this.amount = amount;
    }

    public String getPaymentStatus() {
        return paymentStatus;
    }

    public void setPaymentStatus(String paymentStatus) {
        this.paymentStatus = paymentStatus;
    }
}
