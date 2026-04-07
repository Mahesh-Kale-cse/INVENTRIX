package com.inventrix.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.*;
import lombok.*;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "products")
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(length = 1000)
    private String description;

    // FULLY IGNORE category in JSON (prevents infinite loop)
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "category_id")
   @JsonIgnoreProperties({ "products", "hibernateLazyInitializer", "handler" })
    private Category category;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @Column(name = "stock_quantity", nullable = false)
    private Integer stockQuantity = 0;

    @Column(name = "reorder_level", nullable = false)
    private Integer reorderLevel = 10;

    private String image;
    private String sku;

    @Column(name = "total_sales")
    private Integer totalSales = 0;

    @Enumerated(EnumType.STRING)
    private Trend trend = Trend.STABLE;

    // FULLY IGNORE warehouse in JSON (prevents lazy proxy crash)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "warehouse_id")
    @JsonIgnore
    private Warehouse warehouse;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public enum Trend {
        UP, DOWN, STABLE
    }

    public boolean isLowStock() {
        return this.stockQuantity <= this.reorderLevel;
    }
}