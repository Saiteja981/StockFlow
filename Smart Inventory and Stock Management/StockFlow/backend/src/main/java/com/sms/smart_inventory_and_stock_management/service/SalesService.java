package com.sms.smart_inventory_and_stock_management.service;

import java.util.List;
import com.sms.smart_inventory_and_stock_management.entity.Sales;

public interface SalesService {

    Sales saveSales(Sales sales);

    List<Sales> getAllSales();

    // Additional methods needed for React
    Sales getSalesById(Integer id);

    List<Sales> getSalesByProductId(Integer productId);

    void deleteSales(Integer id);
}