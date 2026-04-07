package com.inventrix.controller;

import com.inventrix.service.ProductService;
import com.inventrix.service.SalesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "${cors.allowed.origins}")
public class DashboardController {

    @Autowired
    private SalesService salesService;

    @Autowired
    private ProductService productService;

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        Map<String, Object> stats = salesService.getDashboardStats();
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/overview")
    public ResponseEntity<Map<String, Object>> getDashboardOverview() {
        Map<String, Object> overview = new HashMap<>();

        // Get sales stats
        Map<String, Object> salesStats = salesService.getDashboardStats();
        overview.putAll(salesStats);

        // Get product stats
        Map<String, Object> productStats = productService.getProductStats();
        overview.put("productStats", productStats);

        // Get monthly data
        overview.put("monthlyData", salesService.getMonthlySalesData());

        // Get predictions
        overview.put("predictions", salesService.getSalesPrediction());

        // Get top products
        overview.put("topProducts", salesService.getTopSellingProducts(5));

        // Get category performance
        overview.put("categoryPerformance", salesService.getCategoryPerformance());

        return ResponseEntity.ok(overview);
    }
}