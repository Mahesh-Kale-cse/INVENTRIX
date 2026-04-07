package com.inventrix.repository;

import com.inventrix.entity.Sales;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface SalesRepository extends JpaRepository<Sales, Long> {
    
    List<Sales> findByProductId(Long productId);
    
    @Query("SELECT s FROM Sales s WHERE s.saleDate BETWEEN :startDate AND :endDate")
    List<Sales> findSalesBetweenDates(LocalDateTime startDate, LocalDateTime endDate);
    
    @Query("SELECT SUM(s.totalAmount) FROM Sales s WHERE s.saleDate BETWEEN :startDate AND :endDate")
    Double calculateRevenueBetweenDates(LocalDateTime startDate, LocalDateTime endDate);
    
    @Query("SELECT SUM(s.quantitySold) FROM Sales s WHERE s.saleDate BETWEEN :startDate AND :endDate")
    Integer calculateTotalSalesBetweenDates(LocalDateTime startDate, LocalDateTime endDate);
    
    @Query("SELECT YEAR(s.saleDate) as year, MONTH(s.saleDate) as month, SUM(s.totalAmount) as revenue FROM Sales s GROUP BY YEAR(s.saleDate), MONTH(s.saleDate) ORDER BY year DESC, month DESC")
    List<Object[]> getMonthlySalesData();
}
