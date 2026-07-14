package com.ims.inventory_management_system.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ims.inventory_management_system.entity.Product;

@Repository
public interface ProductRepository extends JpaRepository<Product, Integer> {

}