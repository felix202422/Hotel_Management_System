package com.hasmirhotels.service;

import java.util.List;

public abstract class AbstractHotelService<T, ID> {
    public abstract List<T> findAll();
    public abstract T findById(ID id);
    public abstract T save(T entity);
    public abstract T update(ID id, T entity);
    public abstract void delete(ID id);
    public abstract long count();
}
