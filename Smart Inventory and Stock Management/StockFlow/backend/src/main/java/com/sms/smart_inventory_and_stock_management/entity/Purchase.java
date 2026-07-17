package com.sms.smart_inventory_and_stock_management.entity;

import java.time.LocalDate;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "purchase")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Purchase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "purchase_id")
    private Integer purchaseId;

    @Column(name = "product_id")
    private Integer productId;

    @Column(name = "product_name")
    private String productName;

    private Integer quantity;

    @Column(name = "purchase_price")
    private Double purchasePrice;

    @Column(name = "total_cost")
    private Double totalCost;

    @Column(name = "purchase_date")
    private LocalDate purchaseDate;

    // Default Constructor
    public Purchase() {
    }

    // Parameterized Constructor
    public Purchase(Integer purchaseId, Integer productId, String productName,
                    Integer quantity, Double purchasePrice, Double totalCost,
                    LocalDate purchaseDate) {
        this.purchaseId = purchaseId;
        this.productId = productId;
        this.productName = productName;
        this.quantity = quantity;
        this.purchasePrice = purchasePrice;
        this.totalCost = totalCost;
        this.purchaseDate = purchaseDate;
    }

    // Getters and Setters
    public Integer getPurchaseId() {
        return purchaseId;
    }

    public void setPurchaseId(Integer purchaseId) {
        this.purchaseId = purchaseId;
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

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public Double getPurchasePrice() {
        return purchasePrice;
    }

    public void setPurchasePrice(Double purchasePrice) {
        this.purchasePrice = purchasePrice;
    }

    public Double getTotalCost() {
        return totalCost;
    }

    public void setTotalCost(Double totalCost) {
        this.totalCost = totalCost;
    }

    public LocalDate getPurchaseDate() {
        return purchaseDate;
    }

    public void setPurchaseDate(LocalDate purchaseDate) {
        this.purchaseDate = purchaseDate;
    }

    @Override
    public String toString() {
        return "Purchase{" +
                "purchaseId=" + purchaseId +
                ", productId=" + productId +
                ", productName='" + productName + '\'' +
                ", quantity=" + quantity +
                ", purchasePrice=" + purchasePrice +
                ", totalCost=" + totalCost +
                ", purchaseDate=" + purchaseDate +
                '}';
    }
}