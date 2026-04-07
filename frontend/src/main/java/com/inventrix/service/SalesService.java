package com.inventrix.service;

import com.inventrix.dto.SalesRequest;
import com.inventrix.entity.Product;
import com.inventrix.entity.Sales;
import com.inventrix.entity.User;
import com.inventrix.repository.ProductRepository;
import com.inventrix.repository.SalesRepository;
import com.inventrix.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
public class SalesService {

    @Autowired
    private SalesRepository salesRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    public Sales recordSale(SalesRequest request) {
        // Get product
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        // Check stock availability
        if (product.getStockQuantity() < request.getQuantity()) {
            throw new RuntimeException("Insufficient stock. Available: " + product.getStockQuantity());
        }

        // Calculate total amount
        BigDecimal totalAmount = product.getPrice().multiply(BigDecimal.valueOf(request.getQuantity()));

        // Create sales record
        Sales sale = new Sales();
        sale.setProduct(product);
        sale.setQuantitySold(request.getQuantity());
        sale.setUnitPrice(product.getPrice());
        sale.setTotalAmount(totalAmount);

        // Set user if provided
        if (request.getUserId() != null) {
            User user = userRepository.findById(request.getUserId())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            sale.setUser(user);
        }

        // Update product stock and sales
        product.setStockQuantity(product.getStockQuantity() - request.getQuantity());
        product.setTotalSales(product.getTotalSales() + request.getQuantity());

        // Update trend
        if (product.getTotalSales() > 50) {
            product.setTrend(Product.Trend.UP);
        }

        productRepository.save(product);

        return salesRepository.save(sale);
    }

    public List<Sales> getAllSales() {
        return salesRepository.findAll();
    }

    public Sales getSaleById(Long id) {
        return salesRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Sale not found with id: " + id));
    }

    public List<Sales> getSalesByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        return salesRepository.findSalesBetweenDates(startDate, endDate);
    }

    public Map<String, Object> getDashboardStats() {
        List<Product> allProducts = productRepository.findAll();
        List<Product> lowStockProducts = productRepository.findLowStockProducts();

        // Today's sales
        LocalDateTime startOfDay = LocalDateTime.now().truncatedTo(ChronoUnit.DAYS);
        LocalDateTime endOfDay = startOfDay.plusDays(1);
        List<Sales> todaySales = getSalesByDateRange(startOfDay, endOfDay);

        Double todayRevenue = todaySales.stream()
                .mapToDouble(s -> s.getTotalAmount().doubleValue())
                .sum();

        // This month's sales
        LocalDateTime startOfMonth = LocalDateTime.now().withDayOfMonth(1).truncatedTo(ChronoUnit.DAYS);
        List<Sales> monthSales = getSalesByDateRange(startOfMonth, LocalDateTime.now());

        Double monthRevenue = monthSales.stream()
                .mapToDouble(s -> s.getTotalAmount().doubleValue())
                .sum();

        // Total revenue
        List<Sales> allSales = salesRepository.findAll();
        Double totalRevenue = allSales.stream()
                .mapToDouble(s -> s.getTotalAmount().doubleValue())
                .sum();

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalProducts", allProducts.size());
        stats.put("lowStockItems", lowStockProducts.size());
        stats.put("todaySales", todayRevenue);
        stats.put("monthRevenue", monthRevenue);
        stats.put("totalRevenue", totalRevenue);
        stats.put("totalTransactions", allSales.size());

        return stats;
    }

    public List<Map<String, Object>> getMonthlySalesData() {
        List<Sales> allSales = salesRepository.findAll();

        // Group by month
        Map<String, List<Sales>> salesByMonth = allSales.stream()
                .collect(Collectors.groupingBy(sale -> sale.getSaleDate().getYear() + "-" +
                        String.format("%02d", sale.getSaleDate().getMonthValue())));

        List<Map<String, Object>> monthlyData = new ArrayList<>();

        for (Map.Entry<String, List<Sales>> entry : salesByMonth.entrySet()) {
            Map<String, Object> monthData = new HashMap<>();
            String[] parts = entry.getKey().split("-");

            monthData.put("year", Integer.parseInt(parts[0]));
            monthData.put("month", Integer.parseInt(parts[1]));
            monthData.put("sales", entry.getValue().stream()
                    .mapToInt(Sales::getQuantitySold)
                    .sum());
            monthData.put("revenue", entry.getValue().stream()
                    .mapToDouble(s -> s.getTotalAmount().doubleValue())
                    .sum());
            monthData.put("transactions", entry.getValue().size());

            monthlyData.add(monthData);
        }

        // Sort by year and month
        monthlyData.sort((a, b) -> {
            int yearCompare = ((Integer) a.get("year")).compareTo((Integer) b.get("year"));
            if (yearCompare != 0)
                return yearCompare;
            return ((Integer) a.get("month")).compareTo((Integer) b.get("month"));
        });

        return monthlyData;
    }

    public Map<String, Object> getRevenueReport(LocalDateTime startDate, LocalDateTime endDate) {
        List<Sales> sales = getSalesByDateRange(startDate, endDate);

        Double totalRevenue = sales.stream()
                .mapToDouble(s -> s.getTotalAmount().doubleValue())
                .sum();

        Integer totalQuantity = sales.stream()
                .mapToInt(Sales::getQuantitySold)
                .sum();

        Map<String, Object> report = new HashMap<>();
        report.put("startDate", startDate);
        report.put("endDate", endDate);
        report.put("totalRevenue", totalRevenue);
        report.put("totalQuantity", totalQuantity);
        report.put("totalTransactions", sales.size());
        report.put("averageTransactionValue", sales.isEmpty() ? 0 : totalRevenue / sales.size());

        return report;
    }

    public Map<String, Object> getSalesPrediction() {
        // Get last 3 months of sales data
        LocalDateTime threeMonthsAgo = LocalDateTime.now().minusMonths(3);
        List<Sales> recentSales = getSalesByDateRange(threeMonthsAgo, LocalDateTime.now());

        // Calculate moving average
        int totalSales = recentSales.stream()
                .mapToInt(Sales::getQuantitySold)
                .sum();

        double averagePerMonth = totalSales / 3.0;

        // Add slight upward trend (10% growth assumption)
        double predictedSales = averagePerMonth * 1.1;

        // Calculate revenue prediction
        double avgUnitPrice = recentSales.stream()
                .mapToDouble(s -> s.getUnitPrice().doubleValue())
                .average()
                .orElse(0.0);

        double predictedRevenue = predictedSales * avgUnitPrice;

        // Calculate confidence based on data consistency
        double confidence = Math.min(0.95, 0.75 + (recentSales.size() / 100.0));

        Map<String, Object> prediction = new HashMap<>();
        prediction.put("predictedSales", (int) Math.round(predictedSales));
        prediction.put("predictedRevenue", Math.round(predictedRevenue));
        prediction.put("confidence", Math.round(confidence * 100));
        prediction.put("basedOnMonths", 3);
        prediction.put("dataPoints", recentSales.size());
        prediction.put("trend", predictedSales > averagePerMonth ? "INCREASING" : "STABLE");

        return prediction;
    }

    public List<Map<String, Object>> getTopSellingProducts(int limit) {
        List<Product> topProducts = productRepository.findTopSellingProducts();

        return topProducts.stream()
                .limit(limit)
                .map(product -> {
                    Map<String, Object> productData = new HashMap<>();
                    productData.put("id", product.getId());
                    productData.put("name", product.getName());
                    productData.put("totalSales", product.getTotalSales());
                    productData.put("price", product.getPrice());
                    productData.put("trend", product.getTrend());
                    return productData;
                })
                .collect(Collectors.toList());
    }

    public Map<String, Object> getCategoryPerformance() {
        List<Sales> allSales = salesRepository.findAll();

        Map<String, Double> categoryRevenue = new HashMap<>();
        Map<String, Integer> categoryQuantity = new HashMap<>();

        for (Sales sale : allSales) {
            String categoryName = sale.getProduct().getCategory() != null ? sale.getProduct().getCategory().getName()
                    : "Uncategorized";

            categoryRevenue.merge(categoryName,
                    sale.getTotalAmount().doubleValue(), Double::sum);
            categoryQuantity.merge(categoryName,
                    sale.getQuantitySold(), Integer::sum);
        }

        List<Map<String, Object>> categoryData = new ArrayList<>();
        for (String category : categoryRevenue.keySet()) {
            Map<String, Object> data = new HashMap<>();
            data.put("category", category);
            data.put("revenue", categoryRevenue.get(category));
            data.put("quantity", categoryQuantity.get(category));
            categoryData.add(data);
        }

        Map<String, Object> result = new HashMap<>();
        result.put("categories", categoryData);
        result.put("totalCategories", categoryData.size());

        return result;
    }
}
