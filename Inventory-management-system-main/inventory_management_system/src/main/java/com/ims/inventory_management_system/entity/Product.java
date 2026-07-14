package com.ims.inventory_management_system.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "product")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer productId;

    @Column(nullable = false)
    private String productName;

    private String category;

    private String brand;

    private double purchasePrice;

    private double sellingPrice;

    private int stockQuantity;

    public Product() {
    }

    public Product(Integer productId, String productName, String category, String brand,
                   double purchasePrice, double sellingPrice, int stockQuantity) {
        this.productId = productId;
        this.productName = productName;
        this.category = category;
        this.brand = brand;
        this.purchasePrice = purchasePrice;
        this.sellingPrice = sellingPrice;
        this.stockQuantity = stockQuantity;
    }

    public Integer getProductId() {
        return productId;
    }

    public void setProductId(Integer productId) {
        this.productId = productId;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getBrand() {
        return brand;
    }

    public void setBrand(String brand) {
        this.brand = brand;
    }

    public double getPurchasePrice() {
        return purchasePrice;
    }

    public void setPurchasePrice(double purchasePrice) {
        this.purchasePrice = purchasePrice;
    }

    public double getSellingPrice() {
        return sellingPrice;
    }

    public void setSellingPrice(double sellingPrice) {
        this.sellingPrice = sellingPrice;
    }

    public int getStockQuantity() {
        return stockQuantity;
    }

    public void setStockQuantity(int stockQuantity) {
        this.stockQuantity = stockQuantity;
    }
}