package com.sms.smart_inventory_and_stock_management.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.sms.smart_inventory_and_stock_management.entity.Product;
import com.sms.smart_inventory_and_stock_management.entity.Purchase;
import com.sms.smart_inventory_and_stock_management.service.ProductService;
import com.sms.smart_inventory_and_stock_management.service.PurchaseService;

@RestController
@RequestMapping("/api/purchases")
@CrossOrigin(origins = "http://localhost:5173")
public class PurchaseController {

    @Autowired
    private PurchaseService purchaseService;

    @Autowired
    private ProductService productService;

    @GetMapping
    public ResponseEntity<List<Purchase>> getAllPurchases() {
        return ResponseEntity.ok(purchaseService.getAllPurchases());
    }

    @PostMapping
    public ResponseEntity<Purchase> createPurchase(@RequestBody Purchase purchase) {
        // Get product details
        Product product = productService.getProductById(purchase.getProductId());
        purchase.setProductName(product.getProductName());
        purchase.setTotalCost(purchase.getQuantity() * purchase.getPurchasePrice());

        // Save purchase
        Purchase savedPurchase = purchaseService.savePurchase(purchase);

        // Update product stock
        product.setStockQuantity(product.getStockQuantity() + purchase.getQuantity());
        productService.updateProduct(product);

        return ResponseEntity.status(HttpStatus.CREATED).body(savedPurchase);
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<List<Purchase>> getPurchasesByProduct(@PathVariable Integer productId) {
        return ResponseEntity.ok(purchaseService.getPurchasesByProductId(productId));
    }
}