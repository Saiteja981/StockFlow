package com.ims.inventory_management_system.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.ims.inventory_management_system.entity.Sales;
import java.util.List;

@Repository
public interface SalesRepository extends JpaRepository<Sales, Integer> {
    List<Sales> findByProductId(Integer productId);
}