package com.fizzohotels.service;

import com.fizzohotels.dto.ApiResponse;
import org.springframework.data.domain.Page;

public abstract class HotelService<T> {

    public abstract ApiResponse<T> create(T entity);

    public abstract ApiResponse<T> update(Long id, T entity);

    public abstract ApiResponse<Void> delete(Long id);

    public abstract ApiResponse<T> getById(Long id);

    public abstract ApiResponse<Page<T>> getAll(int page, int size, String sortBy, String sortDir, String search);
}
