package com.hasmirhotels.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "guest_users")
public class GuestUser extends User {

    @Column(unique = true, nullable = false)
    private String username;

    private String role = "GUEST";

    private String phone;

    private String status = "Active";

    public GuestUser() {}

    public GuestUser(String fullName, String email, String password, String username) {
        super(fullName, email, password);
        this.username = username;
        this.role = "GUEST";
    }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
