package com.sms.smart_inventory_and_stock_management.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.sms.smart_inventory_and_stock_management.entity.Sales;
import java.util.List;

@Repository
public interface SalesRepository extends JpaRepository<Sales, Integer> {
    List<Sales> findByProductId(Integer productId);
}