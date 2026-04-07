package com.inventrix.controller;

import com.inventrix.dto.SalesRequest;
import com.inventrix.entity.Sales;
import com.inventrix.service.SalesService;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.security.access.prepost.PreAuthorize;

import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/sales")
@CrossOrigin(origins = "${cors.allowed.origins}")
public class SalesController {

    @Autowired
    private SalesService salesService;

    // ✅ ADMIN + STAFF CAN RECORD SALE
    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')") // FIXED
    public ResponseEntity<Map<String, Object>> recordSale(
            @Valid @RequestBody SalesRequest request) {

        Sales sale = salesService.recordSale(request);

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Sale recorded successfully");
        response.put("sale", sale);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    // ✅ ADMIN + STAFF CAN RECORD BULK SALES
    @PostMapping("/bulk")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')") // FIXED
    public ResponseEntity<Map<String, Object>> recordBulkSales(
            @Valid @RequestBody List<SalesRequest> requests) {

        List<Sales> sales = new java.util.ArrayList<>();

        for (SalesRequest request : requests) {
            Sales sale = salesService.recordSale(request);
            sales.add(sale);
        }

        Map<String, Object> response = new HashMap<>();
        response.put("message", sales.size() + " sale(s) recorded successfully");
        response.put("sales", sales);
        response.put("count", sales.size());

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    // ✅ ADMIN + STAFF CAN VIEW ALL SALES
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ResponseEntity<List<Sales>> getAllSales() {

        List<Sales> sales = salesService.getAllSales();
        return ResponseEntity.ok(sales);
    }

    // ✅ ADMIN + STAFF CAN VIEW SALE BY ID
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ResponseEntity<Sales> getSaleById(@PathVariable Long id) {

        Sales sale = salesService.getSaleById(id);
        return ResponseEntity.ok(sale);
    }

    // ✅ ADMIN + STAFF CAN VIEW SALES BY DATE RANGE
    @GetMapping("/date-range")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ResponseEntity<List<Sales>> getSalesByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,

            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end) {

        List<Sales> sales = salesService.getSalesByDateRange(start, end);

        return ResponseEntity.ok(sales);
    }

    // ✅ ADMIN + STAFF CAN VIEW DASHBOARD
    @GetMapping("/dashboard")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {

        Map<String, Object> stats = salesService.getDashboardStats();

        return ResponseEntity.ok(stats);
    }

    // ✅ ADMIN + STAFF CAN VIEW MONTHLY DATA
    @GetMapping("/monthly")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ResponseEntity<List<Map<String, Object>>> getMonthlySalesData() {

        List<Map<String, Object>> data = salesService.getMonthlySalesData();

        return ResponseEntity.ok(data);
    }

    // ✅ ADMIN + STAFF CAN VIEW REVENUE REPORT
    @GetMapping("/revenue")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ResponseEntity<Map<String, Object>> getRevenueReport(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,

            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end) {

        Map<String, Object> report = salesService.getRevenueReport(start, end);

        return ResponseEntity.ok(report);
    }

    // ✅ ADMIN + STAFF CAN VIEW SALES PREDICTION
    @GetMapping("/prediction")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ResponseEntity<Map<String, Object>> getSalesPrediction() {

        Map<String, Object> prediction = salesService.getSalesPrediction();

        return ResponseEntity.ok(prediction);
    }

    // ✅ ADMIN + STAFF CAN VIEW TOP SELLING PRODUCTS
    @GetMapping("/top-products")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ResponseEntity<List<Map<String, Object>>> getTopSellingProducts(
            @RequestParam(defaultValue = "10") int limit) {

        List<Map<String, Object>> topProducts = salesService.getTopSellingProducts(limit);

        return ResponseEntity.ok(topProducts);
    }

    // ✅ ADMIN + STAFF CAN VIEW CATEGORY PERFORMANCE
    @GetMapping("/category-performance")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ResponseEntity<Map<String, Object>> getCategoryPerformance() {

        Map<String, Object> performance = salesService.getCategoryPerformance();

        return ResponseEntity.ok(performance);
    }
}