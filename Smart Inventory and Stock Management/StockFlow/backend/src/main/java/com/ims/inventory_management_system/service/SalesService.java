package com.ims.inventory_management_system.service;

import java.util.List;
import com.ims.inventory_management_system.entity.Sales;

public interface SalesService {

    Sales saveSales(Sales sales);

    List<Sales> getAllSales();

    // Additional methods needed for React
    Sales getSalesById(Integer id);

    List<Sales> getSalesByProductId(Integer productId);

    void deleteSales(Integer id);
}