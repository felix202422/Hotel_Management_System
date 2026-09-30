package com.hasmirhotels.service;

import com.hasmirhotels.dto.ApiResponse;
import com.hasmirhotels.entity.Housekeeping;
import com.hasmirhotels.repository.HousekeepingRepository;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

@Service
public class HousekeepingService extends HotelService<Housekeeping> {

    private final HousekeepingRepository housekeepingRepository;

    public HousekeepingService(HousekeepingRepository housekeepingRepository) {
        this.housekeepingRepository = housekeepingRepository;
    }

    @Override
    public ApiResponse<Housekeeping> create(Housekeeping housekeeping) {
        Housekeeping saved = housekeepingRepository.save(housekeeping);
        return ApiResponse.success("Housekeeping record created", saved);
    }

    @Override
    public ApiResponse<Housekeeping> update(Long id, Housekeeping housekeeping) {
        Housekeeping existing = housekeepingRepository.findById(id).orElse(null);
        if (existing == null) {
            return ApiResponse.error("Housekeeping record not found");
        }
        existing.setRoom(housekeeping.getRoom());
        existing.setAssignedStaff(housekeeping.getAssignedStaff());
        existing.setCleaningStatus(housekeeping.getCleaningStatus());
        existing.setCleanedDate(housekeeping.getCleanedDate());
        Housekeeping saved = housekeepingRepository.save(existing);
        return ApiResponse.success("Housekeeping record updated", saved);
    }

    @Override
    public ApiResponse<Void> delete(Long id) {
        if (!housekeepingRepository.existsById(id)) {
            return ApiResponse.error("Housekeeping record not found");
        }
        housekeepingRepository.deleteById(id);
        return ApiResponse.success("Housekeeping record deleted", null);
    }

    @Override
    public ApiResponse<Housekeeping> getById(Long id) {
        Housekeeping record = housekeepingRepository.findById(id).orElse(null);
        if (record == null) {
            return ApiResponse.error("Housekeeping record not found");
        }
        return ApiResponse.success("Housekeeping record found", record);
    }

    @Override
    public ApiResponse<Page<Housekeeping>> getAll(int page, int size, String sortBy, String sortDir, String search) {
        Sort sort = sortDir.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<Housekeeping> records;
        if (search != null && !search.isEmpty()) {
            records = housekeepingRepository.findByAssignedStaffContainingIgnoreCase(search, pageable);
        } else {
            records = housekeepingRepository.findAll(pageable);
        }
        return ApiResponse.success("Housekeeping records retrieved", records);
    }

    public long countByStatus(String status) {
        return housekeepingRepository.countByCleaningStatus(status);
    }
}
