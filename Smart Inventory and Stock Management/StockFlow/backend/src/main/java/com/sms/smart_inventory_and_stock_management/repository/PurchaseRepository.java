package com.sms.smart_inventory_and_stock_management.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.sms.smart_inventory_and_stock_management.entity.Purchase;
import java.util.List;

@Repository
public interface PurchaseRepository extends JpaRepository<Purchase, Integer> {
    List<Purchase> findByProductId(Integer productId);
}