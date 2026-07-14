package com.ims.inventory_management_system.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ims.inventory_management_system.entity.Purchase;

@Repository
public interface PurchaseRepository extends JpaRepository<Purchase, Integer> {

}