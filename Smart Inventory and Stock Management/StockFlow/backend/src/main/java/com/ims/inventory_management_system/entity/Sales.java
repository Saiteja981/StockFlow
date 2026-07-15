package com.ims.inventory_management_system.entity;

import java.time.LocalDate;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "sales")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Sales {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "sales_id")
    private Integer salesId;

    @Column(name = "product_id")
    private Integer productId;

    @Column(name = "product_name")
    private String productName;

    @Column(name = "customer_name")
    private String customerName;

    @Column(name = "quantity_sold")
    private Integer quantitySold;

    @Column(name = "selling_price")
    private Double sellingPrice;

    @Column(name = "total_amount")
    private Double totalAmount;

    @Column(name = "sales_date")
    private LocalDate salesDate;

    // Default Constructor
    public Sales() {
    }

    // Parameterized Constructor
    public Sales(Integer salesId, Integer productId, String productName,
                 String customerName, Integer quantitySold, Double sellingPrice,
                 Double totalAmount, LocalDate salesDate) {
        this.salesId = salesId;
        this.productId = productId;
        this.productName = productName;
        this.customerName = customerName;
        this.quantitySold = quantitySold;
        this.sellingPrice = sellingPrice;
        this.totalAmount = totalAmount;
        this.salesDate = salesDate;
    }

    // Getters and Setters
    public Integer getSalesId() {
        return salesId;
    }

    public void setSalesId(Integer salesId) {
        this.salesId = salesId;
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

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public Integer getQuantitySold() {
        return quantitySold;
    }

    public void setQuantitySold(Integer quantitySold) {
        this.quantitySold = quantitySold;
    }

    public Double getSellingPrice() {
        return sellingPrice;
    }

    public void setSellingPrice(Double sellingPrice) {
        this.sellingPrice = sellingPrice;
    }

    public Double getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(Double totalAmount) {
        this.totalAmount = totalAmount;
    }

    public LocalDate getSalesDate() {
        return salesDate;
    }

    public void setSalesDate(LocalDate salesDate) {
        this.salesDate = salesDate;
    }

    @Override
    public String toString() {
        return "Sales{" +
                "salesId=" + salesId +
                ", productId=" + productId +
                ", productName='" + productName + '\'' +
                ", customerName='" + customerName + '\'' +
                ", quantitySold=" + quantitySold +
                ", sellingPrice=" + sellingPrice +
                ", totalAmount=" + totalAmount +
                ", salesDate=" + salesDate +
                '}';
    }
}