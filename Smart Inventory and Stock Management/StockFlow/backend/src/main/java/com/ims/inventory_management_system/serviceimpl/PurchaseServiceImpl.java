package com.ims.inventory_management_system.serviceimpl;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ims.inventory_management_system.entity.Purchase;
import com.ims.inventory_management_system.repository.PurchaseRepository;
import com.ims.inventory_management_system.service.PurchaseService;

@Service
@Transactional
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

    @Override
    public Purchase getPurchaseById(Integer id) {
        return purchaseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Purchase not found with id: " + id));
    }

    @Override
    public List<Purchase> getPurchasesByProductId(Integer productId) {
        return purchaseRepository.findByProductId(productId);
    }
}