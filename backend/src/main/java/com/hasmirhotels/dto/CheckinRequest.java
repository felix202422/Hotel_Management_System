package com.hasmirhotels.dto;

public class CheckinRequest {
    private Long reservationId;

    public CheckinRequest() {}

    public CheckinRequest(Long reservationId) {
        this.reservationId = reservationId;
    }

    public Long getReservationId() { return reservationId; }
    public void setReservationId(Long reservationId) { this.reservationId = reservationId; }
}
