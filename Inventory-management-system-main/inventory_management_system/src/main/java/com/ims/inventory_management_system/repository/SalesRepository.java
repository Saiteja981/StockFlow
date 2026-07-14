package com.ims.inventory_management_system.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ims.inventory_management_system.entity.Sales;

public interface SalesRepository extends JpaRepository<Sales,Integer>{

}