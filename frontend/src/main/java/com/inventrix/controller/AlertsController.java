package com.inventrix.controller;

import com.inventrix.service.AlertsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/alerts")
@CrossOrigin(origins = "${cors.allowed.origins}")
public class AlertsController {

    @Autowired
    private AlertsService alertsService;

    // Get All Alerts - GET /api/alerts
    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAllAlerts() {
        List<Map<String, Object>> alerts = alertsService.getAllAlerts();
        return ResponseEntity.ok(alerts);
    }

    // Get Low Stock Alerts - GET /api/alerts/low-stock
    @GetMapping("/low-stock")
    public ResponseEntity<List<Map<String, Object>>> getLowStockAlerts() {
        List<Map<String, Object>> alerts = alertsService.getLowStockAlerts();
        return ResponseEntity.ok(alerts);
    }

    // Get Alerts Summary - GET /api/alerts/summary
    @GetMapping("/summary")
    public ResponseEntity<Map<String, Object>> getAlertsSummary() {
        Map<String, Object> summary = alertsService.getAlertsSummary();
        return ResponseEntity.ok(summary);
    }
}