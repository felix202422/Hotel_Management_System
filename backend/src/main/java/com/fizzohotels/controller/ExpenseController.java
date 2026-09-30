package com.fizzohotels.controller;

import com.fizzohotels.dto.ApiResponse;
import com.fizzohotels.entity.Expense;
import com.fizzohotels.repository.ExpenseRepository;
import org.springframework.data.domain.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/expenses")
public class ExpenseController {

    private final ExpenseRepository repository;

    public ExpenseController(ExpenseRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<Expense>>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "expenseId") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<Expense> result = repository.findAll(pageable);
        return ResponseEntity.ok(ApiResponse.success("Expenses retrieved", result));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Expense>> getById(@PathVariable Long id) {
        Expense expense = repository.findById(id).orElse(null);
        if (expense == null) {
            return ResponseEntity.ok(ApiResponse.error("Expense not found"));
        }
        return ResponseEntity.ok(ApiResponse.success("Expense found", expense));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Expense>> create(@RequestBody Expense expense) {
        Expense saved = repository.save(expense);
        return ResponseEntity.ok(ApiResponse.success("Expense created", saved));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Expense>> update(@PathVariable Long id, @RequestBody Expense expense) {
        Expense existing = repository.findById(id).orElse(null);
        if (existing == null) {
            return ResponseEntity.ok(ApiResponse.error("Expense not found"));
        }
        if (expense.getCategory() != null) existing.setCategory(expense.getCategory());
        if (expense.getDescription() != null) existing.setDescription(expense.getDescription());
        if (expense.getAmount() != null) existing.setAmount(expense.getAmount());
        if (expense.getExpenseDate() != null) existing.setExpenseDate(expense.getExpenseDate());
        if (expense.getStatus() != null) existing.setStatus(expense.getStatus());
        if (expense.getRecordedBy() != null) existing.setRecordedBy(expense.getRecordedBy());
        Expense saved = repository.save(existing);
        return ResponseEntity.ok(ApiResponse.success("Expense updated", saved));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        if (!repository.existsById(id)) {
            return ResponseEntity.ok(ApiResponse.error("Expense not found"));
        }
        repository.deleteById(id);
        return ResponseEntity.ok(ApiResponse.success("Expense deleted", null));
    }

    @GetMapping("/total")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getTotalExpenses() {
        List<Object[]> byCategory = repository.sumExpensesByCategory();
        double total = 0.0;
        for (Object[] row : byCategory) {
            total += ((Number) row[1]).doubleValue();
        }
        Map<String, Object> result = Map.of(
                "totalExpenses", total,
                "byCategory", byCategory
        );
        return ResponseEntity.ok(ApiResponse.success("Total expenses", result));
    }
}
