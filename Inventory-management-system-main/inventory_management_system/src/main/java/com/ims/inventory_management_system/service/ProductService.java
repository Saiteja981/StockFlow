package com.ims.inventory_management_system.service;

import java.util.List;

import com.ims.inventory_management_system.entity.Product;

public interface ProductService {

    Product saveProduct(Product product);

    List<Product> getAllProducts();

    Product getProductById(Integer id);

    Product updateProduct(Product product);

    void deleteProduct(Integer id);

}