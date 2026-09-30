package com.fizzohotels.service;

import com.fizzohotels.dto.ApiResponse;
import com.fizzohotels.entity.Guest;
import com.fizzohotels.repository.GuestRepository;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

@Service
public class GuestService extends HotelService<Guest> {

    private final GuestRepository guestRepository;

    public GuestService(GuestRepository guestRepository) {
        this.guestRepository = guestRepository;
    }

    @Override
    public ApiResponse<Guest> create(Guest guest) {
        Guest saved = guestRepository.save(guest);
        return ApiResponse.success("Guest created successfully", saved);
    }

    @Override
    public ApiResponse<Guest> update(Long id, Guest guest) {
        Guest existing = guestRepository.findById(id).orElse(null);
        if (existing == null) {
            return ApiResponse.error("Guest not found");
        }
        existing.setFirstName(guest.getFirstName());
        existing.setLastName(guest.getLastName());
        existing.setGender(guest.getGender());
        existing.setPhone(guest.getPhone());
        existing.setEmail(guest.getEmail());
        existing.setNationality(guest.getNationality());
        existing.setAddress(guest.getAddress());
        Guest saved = guestRepository.save(existing);
        return ApiResponse.success("Guest updated successfully", saved);
    }

    @Override
    public ApiResponse<Void> delete(Long id) {
        if (!guestRepository.existsById(id)) {
            return ApiResponse.error("Guest not found");
        }
        guestRepository.deleteById(id);
        return ApiResponse.success("Guest deleted successfully", null);
    }

    @Override
    public ApiResponse<Guest> getById(Long id) {
        Guest guest = guestRepository.findById(id).orElse(null);
        if (guest == null) {
            return ApiResponse.error("Guest not found");
        }
        return ApiResponse.success("Guest found", guest);
    }

    @Override
    public ApiResponse<Page<Guest>> getAll(int page, int size, String sortBy, String sortDir, String search) {
        Sort sort = sortDir.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<Guest> guests;
        if (search != null && !search.isEmpty()) {
            guests = guestRepository.findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(search, search, pageable);
        } else {
            guests = guestRepository.findAll(pageable);
        }
        return ApiResponse.success("Guests retrieved", guests);
    }
}
