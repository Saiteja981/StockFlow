package com.ims.inventory_management_system.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.ims.inventory_management_system.entity.Product;
import com.ims.inventory_management_system.entity.Sales;
import com.ims.inventory_management_system.service.ProductService;
import com.ims.inventory_management_system.service.SalesService;

@RestController
@RequestMapping("/api/sales")
@CrossOrigin(origins = "http://localhost:5173")
public class SalesController {

    @Autowired
    private SalesService salesService;

    @Autowired
    private ProductService productService;

    @GetMapping
    public ResponseEntity<List<Sales>> getAllSales() {
        return ResponseEntity.ok(salesService.getAllSales());
    }

    @PostMapping
    public ResponseEntity<Sales> createSale(@RequestBody Sales sales) {
        // Get product details
        Product product = productService.getProductById(sales.getProductId());
        sales.setProductName(product.getProductName());
        sales.setTotalAmount(sales.getQuantitySold() * sales.getSellingPrice());

        // Check if enough stock
        if (product.getStockQuantity() < sales.getQuantitySold()) {
            return ResponseEntity.badRequest().build();
        }

        // Save sale
        Sales savedSales = salesService.saveSales(sales);

        // Update product stock
        product.setStockQuantity(product.getStockQuantity() - sales.getQuantitySold());
        productService.updateProduct(product);

        return ResponseEntity.status(HttpStatus.CREATED).body(savedSales);
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<List<Sales>> getSalesByProduct(@PathVariable Integer productId) {
        return ResponseEntity.ok(salesService.getSalesByProductId(productId));
    }
}