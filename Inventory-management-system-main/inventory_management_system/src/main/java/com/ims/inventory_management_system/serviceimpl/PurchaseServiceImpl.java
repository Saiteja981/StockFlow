package com.ims.inventory_management_system.serviceimpl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ims.inventory_management_system.entity.Purchase;
import com.ims.inventory_management_system.repository.PurchaseRepository;
import com.ims.inventory_management_system.service.PurchaseService;

@Service
public class PurchaseServiceImpl implements PurchaseService {

    @Autowired
    private PurchaseRepository purchaseRepository;

    @Override
    public Purchase savePurchase(Purchase purchase) {
        return purchaseRepository.save(purchase);
    }

    @Override
    public List<Purchase> getAllPurchases() {
        return purchaseRepository.findAll();
    }

    @Override
    public void deletePurchase(Integer id) {
        purchaseRepository.deleteById(id);
    }
}