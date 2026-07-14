package com.ims.inventory_management_system.service;

import java.util.List;

import com.ims.inventory_management_system.entity.Purchase;

public interface PurchaseService {

    Purchase savePurchase(Purchase purchase);

    List<Purchase> getAllPurchases();

    void deletePurchase(Integer id);

}