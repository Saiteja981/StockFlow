package com.sms.smart_inventory_and_stock_management.service;

import java.util.List;
import com.sms.smart_inventory_and_stock_management.entity.Product;

public interface ProductService {

    Product saveProduct(Product product);

    List<Product> getAllProducts();

    Product getProductById(Integer id);

    Product updateProduct(Product product);

    void deleteProduct(Integer id);

    // Additional methods needed for React
    Product updateStock(Integer id, Integer quantity);
}