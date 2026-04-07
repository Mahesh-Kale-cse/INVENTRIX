package com.inventrix.service;

import com.inventrix.dto.ProductRequest;
import com.inventrix.entity.Category;
import com.inventrix.entity.Product;
import com.inventrix.entity.Warehouse;
import com.inventrix.repository.CategoryRepository;
import com.inventrix.repository.ProductRepository;
import com.inventrix.repository.WarehouseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Transactional
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private WarehouseRepository warehouseRepository;

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Product getProductById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
    }

    public Product createProduct(ProductRequest request) {
        // Check if SKU already exists
        if (request.getSku() != null && productRepository.existsBySku(request.getSku())) {
            throw new RuntimeException("Product with SKU " + request.getSku() + " already exists");
        }

        Product product = new Product();
        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setStockQuantity(request.getStockQuantity() != null ? request.getStockQuantity() : 0);
        product.setReorderLevel(request.getReorderLevel() != null ? request.getReorderLevel() : 10);
        product.setSku(request.getSku());
        product.setImage(request.getImage());
        product.setTrend(Product.Trend.STABLE);

        // Set category if provided
        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("Category not found"));
            product.setCategory(category);
        }

        // Set warehouse if provided
        if (request.getWarehouseId() != null) {
            Warehouse warehouse = warehouseRepository.findById(request.getWarehouseId())
                    .orElseThrow(() -> new RuntimeException("Warehouse not found"));
            product.setWarehouse(warehouse);
        }

        return productRepository.save(product);
    }

    public Product updateProduct(Long id, ProductRequest request) {
        Product product = getProductById(id);

        if (request.getName() != null) {
            product.setName(request.getName());
        }
        if (request.getDescription() != null) {
            product.setDescription(request.getDescription());
        }
        if (request.getPrice() != null) {
            product.setPrice(request.getPrice());
        }
        if (request.getStockQuantity() != null) {
            product.setStockQuantity(request.getStockQuantity());
        }
        if (request.getReorderLevel() != null) {
            product.setReorderLevel(request.getReorderLevel());
        }
        if (request.getSku() != null) {
            product.setSku(request.getSku());
        }
        if (request.getImage() != null) {
            product.setImage(request.getImage());
        }
        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("Category not found"));
            product.setCategory(category);
        }
        if (request.getWarehouseId() != null) {
            Warehouse warehouse = warehouseRepository.findById(request.getWarehouseId())
                    .orElseThrow(() -> new RuntimeException("Warehouse not found"));
            product.setWarehouse(warehouse);
        }

        return productRepository.save(product);
    }

    public void deleteProduct(Long id) {
        Product product = getProductById(id);
        productRepository.delete(product);
    }

    public List<Product> getLowStockProducts() {
        return productRepository.findLowStockProducts();
    }

    public List<Product> searchProducts(String searchTerm) {
        return productRepository.searchProducts(searchTerm);
    }

    public List<Product> getTopSellingProducts() {
        return productRepository.findTopSellingProducts();
    }

    public List<Product> getProductsByCategory(Long categoryId) {
        return productRepository.findByCategoryId(categoryId);
    }

    public Product updateStock(Long id, Integer quantityChange) {
        Product product = getProductById(id);

        int newStock = product.getStockQuantity() + quantityChange;
        if (newStock < 0) {
            throw new RuntimeException("Insufficient stock. Current stock: " + product.getStockQuantity());
        }

        product.setStockQuantity(newStock);

        // Update trend based on stock changes
        if (quantityChange < 0 && product.getTotalSales() > 0) {
            product.setTrend(Product.Trend.UP);
        }

        return productRepository.save(product);
    }

    public Map<String, Object> getProductStats() {
        List<Product> allProducts = productRepository.findAll();
        List<Product> lowStockProducts = productRepository.findLowStockProducts();

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalProducts", allProducts.size());
        stats.put("lowStockCount", lowStockProducts.size());
        stats.put("totalValue", allProducts.stream()
                .mapToDouble(p -> p.getPrice().doubleValue() * p.getStockQuantity())
                .sum());
        stats.put("averageStock", allProducts.stream()
                .mapToInt(Product::getStockQuantity)
                .average()
                .orElse(0.0));

        return stats;
    }

    public void updateProductTrend(Long productId, Product.Trend trend) {
        Product product = getProductById(productId);
        product.setTrend(trend);
        productRepository.save(product);
    }
}
