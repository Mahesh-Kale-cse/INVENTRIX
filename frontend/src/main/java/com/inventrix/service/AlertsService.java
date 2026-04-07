package com.inventrix.service;

import com.inventrix.entity.Product;
import com.inventrix.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Transactional
public class AlertsService {

    @Autowired
    private ProductRepository productRepository;

    public List<Map<String, Object>> getAllAlerts() {
        List<Map<String, Object>> alerts = new ArrayList<>();

        // Get low stock alerts
        List<Product> lowStockProducts = productRepository.findLowStockProducts();

        for (Product product : lowStockProducts) {
            Map<String, Object> alert = new HashMap<>();
            alert.put("id", product.getId());
            alert.put("type", "LOW_STOCK");
            alert.put("severity", "WARNING");
            alert.put("title", "Low Stock Alert");
            alert.put("message", product.getName() + " is running low on stock");
            alert.put("productId", product.getId());
            alert.put("productName", product.getName());
            alert.put("currentStock", product.getStockQuantity());
            alert.put("reorderLevel", product.getReorderLevel());
            alert.put("timestamp", java.time.LocalDateTime.now());
            alert.put("isRead", false);

            alerts.add(alert);
        }

        return alerts;
    }

    public List<Map<String, Object>> getLowStockAlerts() {
        List<Map<String, Object>> alerts = new ArrayList<>();
        List<Product> lowStockProducts = productRepository.findLowStockProducts();

        for (Product product : lowStockProducts) {
            Map<String, Object> alert = new HashMap<>();
            alert.put("id", product.getId());
            alert.put("productId", product.getId());
            alert.put("productName", product.getName());
            alert.put("currentStock", product.getStockQuantity());
            alert.put("reorderLevel", product.getReorderLevel());
            alert.put("category", product.getCategory() != null ? product.getCategory().getName() : "Uncategorized");
            alert.put("message", "Stock level is below reorder point");
            alert.put("severity", product.getStockQuantity() == 0 ? "CRITICAL" : "WARNING");

            alerts.add(alert);
        }

        return alerts;
    }

    public Map<String, Object> getAlertsSummary() {
        Map<String, Object> summary = new HashMap<>();

        List<Product> lowStockProducts = productRepository.findLowStockProducts();

        summary.put("totalAlerts", lowStockProducts.size());
        summary.put("criticalAlerts", lowStockProducts.stream()
                .filter(p -> p.getStockQuantity() == 0)
                .count());
        summary.put("warningAlerts", lowStockProducts.stream()
                .filter(p -> p.getStockQuantity() > 0)
                .count());
        summary.put("lowStockCount", lowStockProducts.size());

        return summary;
    }
}
