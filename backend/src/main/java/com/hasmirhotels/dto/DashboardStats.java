package com.hasmirhotels.dto;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

public class DashboardStats {

    private long totalRooms;
    private long availableRooms;
    private long occupiedRooms;
    private long reservedRooms;
    private long maintenanceRooms;
    private long todayCheckins;
    private long todayCheckouts;
    private long activeReservations;
    private BigDecimal todayRevenue;
    private BigDecimal totalRevenue;
    private double occupancyRate;
    private long totalGuests;
    private long totalStaff;
    private long pendingMaintenance;
    private long pendingPayments;
    private List<Map<String, Object>> monthlyRevenue;
    private List<Map<String, Object>> occupancyTrend;
    private List<Map<String, Object>> roomAvailability;
    private List<Map<String, Object>> bookingSources;
    private List<Map<String, Object>> recentReservations;
    private List<Map<String, Object>> todayArrivals;
    private List<Map<String, Object>> todayDepartures;

    public long getTotalRooms() { return totalRooms; }
    public void setTotalRooms(long totalRooms) { this.totalRooms = totalRooms; }
    public long getAvailableRooms() { return availableRooms; }
    public void setAvailableRooms(long availableRooms) { this.availableRooms = availableRooms; }
    public long getOccupiedRooms() { return occupiedRooms; }
    public void setOccupiedRooms(long occupiedRooms) { this.occupiedRooms = occupiedRooms; }
    public long getReservedRooms() { return reservedRooms; }
    public void setReservedRooms(long reservedRooms) { this.reservedRooms = reservedRooms; }
    public long getMaintenanceRooms() { return maintenanceRooms; }
    public void setMaintenanceRooms(long maintenanceRooms) { this.maintenanceRooms = maintenanceRooms; }
    public long getTodayCheckins() { return todayCheckins; }
    public void setTodayCheckins(long todayCheckins) { this.todayCheckins = todayCheckins; }
    public long getTodayCheckouts() { return todayCheckouts; }
    public void setTodayCheckouts(long todayCheckouts) { this.todayCheckouts = todayCheckouts; }
    public long getActiveReservations() { return activeReservations; }
    public void setActiveReservations(long activeReservations) { this.activeReservations = activeReservations; }
    public BigDecimal getTodayRevenue() { return todayRevenue; }
    public void setTodayRevenue(BigDecimal todayRevenue) { this.todayRevenue = todayRevenue; }
    public BigDecimal getTotalRevenue() { return totalRevenue; }
    public void setTotalRevenue(BigDecimal totalRevenue) { this.totalRevenue = totalRevenue; }
    public double getOccupancyRate() { return occupancyRate; }
    public void setOccupancyRate(double occupancyRate) { this.occupancyRate = occupancyRate; }
    public long getTotalGuests() { return totalGuests; }
    public void setTotalGuests(long totalGuests) { this.totalGuests = totalGuests; }
    public long getTotalStaff() { return totalStaff; }
    public void setTotalStaff(long totalStaff) { this.totalStaff = totalStaff; }
    public long getPendingMaintenance() { return pendingMaintenance; }
    public void setPendingMaintenance(long pendingMaintenance) { this.pendingMaintenance = pendingMaintenance; }
    public long getPendingPayments() { return pendingPayments; }
    public void setPendingPayments(long pendingPayments) { this.pendingPayments = pendingPayments; }
    public List<Map<String, Object>> getMonthlyRevenue() { return monthlyRevenue; }
    public void setMonthlyRevenue(List<Map<String, Object>> monthlyRevenue) { this.monthlyRevenue = monthlyRevenue; }
    public List<Map<String, Object>> getOccupancyTrend() { return occupancyTrend; }
    public void setOccupancyTrend(List<Map<String, Object>> occupancyTrend) { this.occupancyTrend = occupancyTrend; }
    public List<Map<String, Object>> getRoomAvailability() { return roomAvailability; }
    public void setRoomAvailability(List<Map<String, Object>> roomAvailability) { this.roomAvailability = roomAvailability; }
    public List<Map<String, Object>> getBookingSources() { return bookingSources; }
    public void setBookingSources(List<Map<String, Object>> bookingSources) { this.bookingSources = bookingSources; }
    public List<Map<String, Object>> getRecentReservations() { return recentReservations; }
    public void setRecentReservations(List<Map<String, Object>> recentReservations) { this.recentReservations = recentReservations; }
    public List<Map<String, Object>> getTodayArrivals() { return todayArrivals; }
    public void setTodayArrivals(List<Map<String, Object>> todayArrivals) { this.todayArrivals = todayArrivals; }
    public List<Map<String, Object>> getTodayDepartures() { return todayDepartures; }
    public void setTodayDepartures(List<Map<String, Object>> todayDepartures) { this.todayDepartures = todayDepartures; }
}
