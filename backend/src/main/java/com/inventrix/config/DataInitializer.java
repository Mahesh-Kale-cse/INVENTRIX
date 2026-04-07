package com.inventrix.config;

import com.inventrix.entity.*;
import com.inventrix.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.HashSet;
import java.util.Set;

@Component
public class DataInitializer implements CommandLineRunner {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private CategoryRepository categoryRepository;
    
    @Autowired
    private WarehouseRepository warehouseRepository;
    
    @Autowired
    private ProductRepository productRepository;
    
    @Autowired
    private SalesRepository salesRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Override
    public void run(String... args) throws Exception {
        // Only initialize if database is empty
        if (userRepository.count() == 0) {
            System.out.println("🌱 Initializing database with sample data...");
            
            // Create users
            createUsers();
            
            // Create categories
            createCategories();
            
            // Create warehouse
            createWarehouse();
            
            // Create products
            createProducts();
            
            System.out.println("✅ Database initialization complete!");
        }
    }
    
    private void createUsers() {
        // Create admin user
        User admin = new User();
        admin.setUsername("admin");
        admin.setPassword(passwordEncoder.encode("admin123"));
        admin.setEmail("admin@inventrix.com");
        admin.setFullName("Admin User");
        admin.setIsActive(true);
        Set<User.Role> adminRoles = new HashSet<>();
        adminRoles.add(User.Role.ADMIN);
        admin.setRoles(adminRoles);
        userRepository.save(admin);
        
        // Create staff user
        User staff = new User();
        staff.setUsername("staff");
        staff.setPassword(passwordEncoder.encode("staff123"));
        staff.setEmail("staff@inventrix.com");
        staff.setFullName("Staff User");
        staff.setIsActive(true);
        Set<User.Role> staffRoles = new HashSet<>();
        staffRoles.add(User.Role.STAFF);
        staff.setRoles(staffRoles);
        userRepository.save(staff);
        
        System.out.println("👤 Created users: admin, staff");
    }
    
    private void createCategories() {
        Category electronics = new Category();
        electronics.setName("Electronics");
        electronics.setDescription("Electronic devices and gadgets");
        categoryRepository.save(electronics);
        
        Category furniture = new Category();
        furniture.setName("Furniture");
        furniture.setDescription("Office and home furniture");
        categoryRepository.save(furniture);
        
        Category accessories = new Category();
        accessories.setName("Accessories");
        accessories.setDescription("Computer and office accessories");
        categoryRepository.save(accessories);
        
        System.out.println("📂 Created categories: Electronics, Furniture, Accessories");
    }
    
    private void createWarehouse() {
        Warehouse warehouse = new Warehouse();
        warehouse.setName("Main Warehouse");
        warehouse.setLocation("Downtown");
        warehouse.setAddress("123 Main Street, City, Country");
        warehouse.setContactNumber("+1234567890");
        warehouseRepository.save(warehouse);
        
        System.out.println("🏢 Created warehouse: Main Warehouse");
    }
    
    private void createProducts() {
        Category electronics = categoryRepository.findByName("Electronics").orElse(null);
        Category furniture = categoryRepository.findByName("Furniture").orElse(null);
        Category accessories = categoryRepository.findByName("Accessories").orElse(null);
        Warehouse warehouse = warehouseRepository.findByName("Main Warehouse").orElse(null);
        
        // Product 1
        Product laptop = new Product();
        laptop.setName("Laptop Dell XPS 15");
        laptop.setDescription("High-performance laptop with 16GB RAM");
        laptop.setCategory(electronics);
        laptop.setPrice(new BigDecimal("1200.00"));
        laptop.setStockQuantity(15);
        laptop.setReorderLevel(10);
        laptop.setSku("LAP-DELL-001");
        laptop.setImage("💻");
        laptop.setTotalSales(45);
        laptop.setTrend(Product.Trend.UP);
        laptop.setWarehouse(warehouse);
        productRepository.save(laptop);
        
        // Product 2
        Product iphone = new Product();
        iphone.setName("iPhone 15 Pro Max");
        iphone.setDescription("Latest Apple smartphone");
        iphone.setCategory(electronics);
        iphone.setPrice(new BigDecimal("999.00"));
        iphone.setStockQuantity(8);
        iphone.setReorderLevel(15);
        iphone.setSku("PHO-APPL-001");
        iphone.setImage("📱");
        iphone.setTotalSales(78);
        iphone.setTrend(Product.Trend.UP);
        iphone.setWarehouse(warehouse);
        productRepository.save(iphone);
        
        // Product 3
        Product chair = new Product();
        chair.setName("Herman Miller Chair");
        chair.setDescription("Ergonomic office chair");
        chair.setCategory(furniture);
        chair.setPrice(new BigDecimal("250.00"));
        chair.setStockQuantity(25);
        chair.setReorderLevel(10);
        chair.setSku("FUR-CHAI-001");
        chair.setImage("🪑");
        chair.setTotalSales(32);
        chair.setTrend(Product.Trend.STABLE);
        chair.setWarehouse(warehouse);
        productRepository.save(chair);
        
        // Product 4
        Product lamp = new Product();
        lamp.setName("Philips Hue Desk Lamp");
        lamp.setDescription("Smart LED desk lamp");
        lamp.setCategory(furniture);
        lamp.setPrice(new BigDecimal("45.00"));
        lamp.setStockQuantity(5);
        lamp.setReorderLevel(10);
        lamp.setSku("FUR-LAMP-001");
        lamp.setImage("💡");
        lamp.setTotalSales(67);
        lamp.setTrend(Product.Trend.DOWN);
        lamp.setWarehouse(warehouse);
        productRepository.save(lamp);
        
        // Product 5
        Product mouse = new Product();
        mouse.setName("Logitech MX Master 3S");
        mouse.setDescription("Wireless mouse");
        mouse.setCategory(accessories);
        mouse.setPrice(new BigDecimal("35.00"));
        mouse.setStockQuantity(50);
        mouse.setReorderLevel(20);
        mouse.setSku("ACC-MOUS-001");
        mouse.setImage("🖱️");
        mouse.setTotalSales(120);
        mouse.setTrend(Product.Trend.UP);
        mouse.setWarehouse(warehouse);
        productRepository.save(mouse);
        
        // Product 6
        Product cable = new Product();
        cable.setName("Anker USB-C Cable Pro");
        cable.setDescription("High-speed charging cable");
        cable.setCategory(accessories);
        cable.setPrice(new BigDecimal("15.00"));
        cable.setStockQuantity(3);
        cable.setReorderLevel(30);
        cable.setSku("ACC-CABL-001");
        cable.setImage("🔌");
        cable.setTotalSales(89);
        cable.setTrend(Product.Trend.STABLE);
        cable.setWarehouse(warehouse);
        productRepository.save(cable);
        
        // Product 7
        Product monitor = new Product();
        monitor.setName("Samsung 27\" Monitor");
        monitor.setDescription("4K UHD monitor");
        monitor.setCategory(electronics);
        monitor.setPrice(new BigDecimal("350.00"));
        monitor.setStockQuantity(12);
        monitor.setReorderLevel(8);
        monitor.setSku("MON-SAMS-001");
        monitor.setImage("🖥️");
        monitor.setTotalSales(56);
        monitor.setTrend(Product.Trend.UP);
        monitor.setWarehouse(warehouse);
        productRepository.save(monitor);
        
        // Product 8
        Product headphones = new Product();
        headphones.setName("Sony WH-1000XM5");
        headphones.setDescription("Noise-canceling headphones");
        headphones.setCategory(accessories);
        headphones.setPrice(new BigDecimal("399.00"));
        headphones.setStockQuantity(18);
        headphones.setReorderLevel(12);
        headphones.setSku("ACC-HEAD-001");
        headphones.setImage("🎧");
        headphones.setTotalSales(92);
        headphones.setTrend(Product.Trend.UP);
        headphones.setWarehouse(warehouse);
        productRepository.save(headphones);
        
        System.out.println("📦 Created 8 sample products");
    }
}
