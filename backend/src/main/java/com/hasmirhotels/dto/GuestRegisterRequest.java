package com.hasmirhotels.dto;

public class GuestRegisterRequest {
    private String fullName;
    private String email;
    private String password;
    private String phone;
    private String nationality;
    private String address;

    public GuestRegisterRequest() {}

    public GuestRegisterRequest(String fullName, String email, String password, String phone, String nationality, String address) {
        this.fullName = fullName;
        this.email = email;
        this.password = password;
        this.phone = phone;
        this.nationality = nationality;
        this.address = address;
    }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public String getNationality() { return nationality; }
    public void setNationality(String nationality) { this.nationality = nationality; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
}
