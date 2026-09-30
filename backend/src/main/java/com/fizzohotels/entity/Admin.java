package com.fizzohotels.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "admins")
public class Admin extends User {

    @Column(unique = true, nullable = false)
    private String username;

    private String role = "ADMIN";

    private String phone;

    private String department;

    private String position;

    private String status = "Active";

    private String profilePhoto;

    public Admin() {}

    public Admin(String fullName, String email, String password, String username) {
        super(fullName, email, password);
        this.username = username;
        this.role = "ADMIN";
    }

    public Admin(String fullName, String email, String password, String username, String phone,
                 String department, String position, String status, String profilePhoto) {
        super(fullName, email, password);
        this.username = username;
        this.role = "ADMIN";
        this.phone = phone;
        this.department = department;
        this.position = position;
        this.status = status;
        this.profilePhoto = profilePhoto;
    }

    public String displayRole() {
        return role;
    }

    public String displayDashboard() {
        return "Admin Dashboard";
    }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public String getPosition() { return position; }
    public void setPosition(String position) { this.position = position; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getProfilePhoto() { return profilePhoto; }
    public void setProfilePhoto(String profilePhoto) { this.profilePhoto = profilePhoto; }
}
