package com.hasmirhotels.dto;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

public class DashboardDTO {
    private Map<String, Object> stats;
    private Map<String, Object> charts;
    private Map<String, Object> todayActivities;
    private List<?> recentReservations;
    private List<?> recentPayments;

    public DashboardDTO() {}

    public Map<String, Object> getStats() { return stats; }
    public void setStats(Map<String, Object> stats) { this.stats = stats; }
    public Map<String, Object> getCharts() { return charts; }
    public void setCharts(Map<String, Object> charts) { this.charts = charts; }
    public Map<String, Object> getTodayActivities() { return todayActivities; }
    public void setTodayActivities(Map<String, Object> todayActivities) { this.todayActivities = todayActivities; }
    public List<?> getRecentReservations() { return recentReservations; }
    public void setRecentReservations(List<?> recentReservations) { this.recentReservations = recentReservations; }
    public List<?> getRecentPayments() { return recentPayments; }
    public void setRecentPayments(List<?> recentPayments) { this.recentPayments = recentPayments; }
}
