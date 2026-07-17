package com.sms.smart_inventory_and_stock_management.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.sms.smart_inventory_and_stock_management.entity.Product;

@Repository
public interface ProductRepository extends JpaRepository<Product, Integer> {

}