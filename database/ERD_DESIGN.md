# HASMIR HOTELS - Entity Relationship Diagram

```
┌──────────────┐
│    User      │  (ABSTRACT - PARENT)
│──────────────│
│ id           │
│ fullName     │
│ email        │
│ password     │
│ createdAt    │
│──────────────│
│ displayRole()│  ← ABSTRACT
│ displayDash.()│ ← ABSTRACT
└──────┬───────┘
       │ extends (JOINED)
┌──────▼───────┐
│    Admin     │
│──────────────│
│ username     │
│ role         │
│──────────────│
│ @Override    │
│ displayRole()│
│ displayDash()│
└──────────────┘

┌──────────────┐           ┌──────────────────┐
│    Room      │           │   Reservation    │
│──────────────│           │──────────────────│
│ roomId (PK)  │◄──────────┤ reservationId(PK)│
│ roomNumber   │  1:N      │ guestId (FK)     │
│ roomType     │           │ roomId (FK)      │
│ floor        │           │ checkInDate      │
│ capacity     │           │ checkOutDate     │
│ pricePerNight│           │ totalPrice       │
│ roomStatus   │           │ reservationStatus│
└──────────────┘           └────────┬─────────┘
       │                            │
       │ 1:N                         │ 1:1
       │                            │
┌──────▼────────┐          ┌────────▼────────┐
│ Housekeeping  │          │    Payment      │
│────────────────│          │─────────────────│
│ housekeepingId│          │ paymentId (PK)  │
│ roomId (FK)   │          │ reservationId   │
│ assignedStaff │          │ paymentMethod   │
│ cleaningStatus│          │ paymentDate     │
│ cleanedDate   │          │ amount          │
└───────────────┘          │ paymentStatus   │
                            └─────────────────┘

┌──────────────┐
│    Guest     │
│──────────────│
│ guestId (PK) │◄──────────┐
│ firstName    │    1:N    │
│ lastName     │           │
│ gender       │           │
│ phone        │           │
│ email        │           │
│ nationality  │           │
│ address      │           │
└──────────────┘           │
                           │
                           │
┌──────────────────────────┘
│
│ RELATIONSHIPS:
│ One Room → Many Reservations
│ One Guest → Many Reservations
│ One Reservation → One Payment
│ One Room → Many Housekeeping Records
│
│ Annotations: @OneToMany, @ManyToOne, @OneToOne, @JoinColumn
│ Fetch types: LAZY loading throughout
│ Cascade: ALL for parent→child relationships
