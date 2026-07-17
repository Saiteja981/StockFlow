package com.sms.smart_inventory_and_stock_management.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.sms.smart_inventory_and_stock_management.entity.Product;
import com.sms.smart_inventory_and_stock_management.entity.Sales;
import com.sms.smart_inventory_and_stock_management.service.ProductService;
import com.sms.smart_inventory_and_stock_management.service.SalesService;

import java.util.List;

@RestController
@RequestMapping("/api/sales")
@CrossOrigin(origins = "http://localhost:5173")
public class SalesController {

    @Autowired
    private SalesService salesService;

    @Autowired
    private ProductService productService;

    // ✅ Get all sales
    @GetMapping
    public ResponseEntity<List<Sales>> getAllSales() {
        List<Sales> sales = salesService.getAllSales();
        return ResponseEntity.ok(sales);
    }

    // ✅ Get sale by ID
    @GetMapping("/{id}")
    public ResponseEntity<Sales> getSaleById(@PathVariable Integer id) {
        Sales sale = salesService.getSalesById(id);
        return ResponseEntity.ok(sale);
    }

    // ✅ Create sale
    @PostMapping
    public ResponseEntity<Sales> createSale(@RequestBody Sales sales) {
        // Calculate total amount
        Double totalAmount = sales.calculateTotalAmount();
        sales.setTotalAmount(totalAmount);

        // Get product details
        Product product = productService.getProductById(sales.getProductId());
        sales.setProductName(product.getProductName());

        // Check if enough stock
        if (product.getStockQuantity() < sales.getQuantitySold()) {
            return ResponseEntity.badRequest().body(null);
        }

        // Save sale
        Sales savedSales = salesService.saveSales(sales);

        // Update product stock
        product.setStockQuantity(product.getStockQuantity() - sales.getQuantitySold());
        productService.updateProduct(product);

        return ResponseEntity.status(HttpStatus.CREATED).body(savedSales);
    }

    // ✅ Get sales by product
    @GetMapping("/product/{productId}")
    public ResponseEntity<List<Sales>> getSalesByProduct(@PathVariable Integer productId) {
        List<Sales> sales = salesService.getSalesByProductId(productId);
        return ResponseEntity.ok(sales);
    }

    // ✅ Delete sale
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSale(@PathVariable Integer id) {
        // Get sale details first
        Sales sale = salesService.getSalesById(id);

        // Get product and restore stock
        Product product = productService.getProductById(sale.getProductId());
        product.setStockQuantity(product.getStockQuantity() + sale.getQuantitySold());
        productService.updateProduct(product);

        // Delete sale
        salesService.deleteSales(id);
        return ResponseEntity.noContent().build();
    }

    // ✅ Get sales summary
    @GetMapping("/summary")
    public ResponseEntity<SalesSummary> getSalesSummary() {
        List<Sales> allSales = salesService.getAllSales();

        int totalSales = allSales.size();
        double totalRevenue = allSales.stream()
                .mapToDouble(s -> s.getTotalAmount() != null ? s.getTotalAmount() : 0)
                .sum();
        double totalQuantity = allSales.stream()
                .mapToDouble(s -> s.getQuantitySold() != null ? s.getQuantitySold() : 0)
                .sum();

        SalesSummary summary = new SalesSummary(totalSales, totalRevenue, totalQuantity);
        return ResponseEntity.ok(summary);
    }

    // ✅ Inner class for sales summary
    public static class SalesSummary {
        private int totalSales;
        private double totalRevenue;
        private double totalQuantity;

        public SalesSummary(int totalSales, double totalRevenue, double totalQuantity) {
            this.totalSales = totalSales;
            this.totalRevenue = totalRevenue;
            this.totalQuantity = totalQuantity;
        }

        public int getTotalSales() { return totalSales; }
        public double getTotalRevenue() { return totalRevenue; }
        public double getTotalQuantity() { return totalQuantity; }
    }
}