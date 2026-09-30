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
@Table(name = "housekeeping")
public class Housekeeping {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long housekeepingId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_id", nullable = false)
    private Room room;

    @Column(nullable = false)
    private String assignedStaff;

    @Column(nullable = false)
    private String cleaningStatus = "Pending";

    private LocalDate cleanedDate;
}
