package com.fizzohotels.dto;

import java.time.LocalDate;

public class HousekeepingDTO {

    private Long housekeepingId;
    private Long roomId;
    private String roomNumber;
    private String assignedStaff;
    private String cleaningStatus;
    private LocalDate cleanedDate;

    public HousekeepingDTO() {
    }

    public HousekeepingDTO(Long housekeepingId, Long roomId, String roomNumber, String assignedStaff, String cleaningStatus, LocalDate cleanedDate) {
        this.housekeepingId = housekeepingId;
        this.roomId = roomId;
        this.roomNumber = roomNumber;
        this.assignedStaff = assignedStaff;
        this.cleaningStatus = cleaningStatus;
        this.cleanedDate = cleanedDate;
    }

    public Long getHousekeepingId() {
        return housekeepingId;
    }

    public void setHousekeepingId(Long housekeepingId) {
        this.housekeepingId = housekeepingId;
    }

    public Long getRoomId() {
        return roomId;
    }

    public void setRoomId(Long roomId) {
        this.roomId = roomId;
    }

    public String getRoomNumber() {
        return roomNumber;
    }

    public void setRoomNumber(String roomNumber) {
        this.roomNumber = roomNumber;
    }

    public String getAssignedStaff() {
        return assignedStaff;
    }

    public void setAssignedStaff(String assignedStaff) {
        this.assignedStaff = assignedStaff;
    }

    public String getCleaningStatus() {
        return cleaningStatus;
    }

    public void setCleaningStatus(String cleaningStatus) {
        this.cleaningStatus = cleaningStatus;
    }

    public LocalDate getCleanedDate() {
        return cleanedDate;
    }

    public void setCleanedDate(LocalDate cleanedDate) {
        this.cleanedDate = cleanedDate;
    }
}
