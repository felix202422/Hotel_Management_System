package com.hasmirhotels.service;

import com.hasmirhotels.dto.ApiResponse;
import com.hasmirhotels.entity.Payment;
import com.hasmirhotels.repository.PaymentRepository;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

@Service
public class PaymentService extends HotelService<Payment> {

    private final PaymentRepository paymentRepository;

    public PaymentService(PaymentRepository paymentRepository) {
        this.paymentRepository = paymentRepository;
    }

    @Override
    public ApiResponse<Payment> create(Payment payment) {
        Payment saved = paymentRepository.save(payment);
        return ApiResponse.success("Payment created successfully", saved);
    }

    @Override
    public ApiResponse<Payment> update(Long id, Payment payment) {
        Payment existing = paymentRepository.findById(id).orElse(null);
        if (existing == null) {
            return ApiResponse.error("Payment not found");
        }
        existing.setReservation(payment.getReservation());
        existing.setPaymentMethod(payment.getPaymentMethod());
        existing.setPaymentDate(payment.getPaymentDate());
        existing.setAmount(payment.getAmount());
        existing.setPaymentStatus(payment.getPaymentStatus());
        Payment saved = paymentRepository.save(existing);
        return ApiResponse.success("Payment updated successfully", saved);
    }

    @Override
    public ApiResponse<Void> delete(Long id) {
        if (!paymentRepository.existsById(id)) {
            return ApiResponse.error("Payment not found");
        }
        paymentRepository.deleteById(id);
        return ApiResponse.success("Payment deleted successfully", null);
    }

    @Override
    public ApiResponse<Payment> getById(Long id) {
        Payment payment = paymentRepository.findById(id).orElse(null);
        if (payment == null) {
            return ApiResponse.error("Payment not found");
        }
        return ApiResponse.success("Payment found", payment);
    }

    @Override
    public ApiResponse<Page<Payment>> getAll(int page, int size, String sortBy, String sortDir, String search) {
        Sort sort = sortDir.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<Payment> payments;
        if (search != null && !search.isEmpty()) {
            payments = paymentRepository.findByPaymentStatusContainingIgnoreCase(search, pageable);
        } else {
            payments = paymentRepository.findAll(pageable);
        }
        return ApiResponse.success("Payments retrieved", payments);
    }

    public Double getTotalRevenue() {
        Double rev = paymentRepository.getTotalRevenue();
        return rev != null ? rev : 0.0;
    }
}
