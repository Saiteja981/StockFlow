package com.ims.inventory_management_system.service;

import java.util.List;

import com.ims.inventory_management_system.entity.Sales;

public interface SalesService {

    Sales saveSales(Sales sales);

    List<Sales> getAllSales();

}