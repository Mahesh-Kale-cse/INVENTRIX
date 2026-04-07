package com.inventrix.controller;

import com.inventrix.dto.ProductRequest;
import com.inventrix.entity.Product;
import com.inventrix.service.ProductService;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.security.access.prepost.PreAuthorize;

import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "${cors.allowed.origins}")
public class ProductController {

    @Autowired
    private ProductService productService;

    // ✅ ADMIN + STAFF CAN VIEW PRODUCTS
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ResponseEntity<List<Product>> getAllProducts() {

        List<Product> products = productService.getAllProducts();
        return ResponseEntity.ok(products);
    }

    // ✅ ADMIN + STAFF CAN VIEW PRODUCT BY ID
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {

        Product product = productService.getProductById(id);
        return ResponseEntity.ok(product);
    }

    // ✅ ONLY ADMIN CAN CREATE PRODUCT
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')") // FIXED
    public ResponseEntity<Map<String, Object>> createProduct(
            @Valid @RequestBody ProductRequest request) {

        Product product = productService.createProduct(request);

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Product created successfully");
        response.put("product", product);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    // ✅ ONLY ADMIN CAN UPDATE PRODUCT
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')") // FIXED
    public ResponseEntity<Map<String, Object>> updateProduct(
            @PathVariable Long id,
            @Valid @RequestBody ProductRequest request) {

        Product product = productService.updateProduct(id, request);

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Product updated successfully");
        response.put("product", product);

        return ResponseEntity.ok(response);
    }

    // ✅ ONLY ADMIN CAN DELETE PRODUCT
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')") // FIXED
    public ResponseEntity<Map<String, String>> deleteProduct(
            @PathVariable Long id) {

        productService.deleteProduct(id);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Product deleted successfully");

        return ResponseEntity.ok(response);
    }

    // ✅ ADMIN + STAFF CAN VIEW LOW STOCK PRODUCTS
    @GetMapping("/low-stock")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ResponseEntity<List<Product>> getLowStockProducts() {

        List<Product> products = productService.getLowStockProducts();
        return ResponseEntity.ok(products);
    }

    // ✅ ADMIN + STAFF CAN SEARCH PRODUCTS
    @GetMapping("/search")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ResponseEntity<List<Product>> searchProducts(
            @RequestParam String q) {

        List<Product> products = productService.searchProducts(q);
        return ResponseEntity.ok(products);
    }

    // ✅ ADMIN + STAFF CAN VIEW TOP SELLING PRODUCTS
    @GetMapping("/top-selling")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ResponseEntity<List<Product>> getTopSellingProducts() {

        List<Product> products = productService.getTopSellingProducts();
        return ResponseEntity.ok(products);
    }

    // ✅ ADMIN + STAFF CAN VIEW PRODUCTS BY CATEGORY
    @GetMapping("/category/{categoryId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ResponseEntity<List<Product>> getProductsByCategory(
            @PathVariable Long categoryId) {

        List<Product> products = productService.getProductsByCategory(categoryId);
        return ResponseEntity.ok(products);
    }

    // ✅ ADMIN + STAFF CAN UPDATE STOCK
    @PatchMapping("/{id}/stock")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')") // FIXED
    public ResponseEntity<Map<String, Object>> updateStock(
            @PathVariable Long id,
            @RequestBody Map<String, Integer> request) {

        Integer quantity = request.get("quantity");

        Product product = productService.updateStock(id, quantity);

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Stock updated successfully");
        response.put("product", product);

        return ResponseEntity.ok(response);
    }

    // ✅ ADMIN + STAFF CAN VIEW PRODUCT STATS
    @GetMapping("/stats")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ResponseEntity<Map<String, Object>> getProductStats() {

        Map<String, Object> stats = productService.getProductStats();
        return ResponseEntity.ok(stats);
    }
}