package com.sms.smart_inventory_and_stock_management.service;

import java.util.List;
import com.sms.smart_inventory_and_stock_management.entity.Purchase;

public interface PurchaseService {

    Purchase savePurchase(Purchase purchase);

    List<Purchase> getAllPurchases();

    void deletePurchase(Integer id);

    // Additional methods needed for React
    Purchase getPurchaseById(Integer id);

    List<Purchase> getPurchasesByProductId(Integer productId);
}