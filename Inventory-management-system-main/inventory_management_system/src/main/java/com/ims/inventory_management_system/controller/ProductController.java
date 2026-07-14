package com.ims.inventory_management_system.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import com.ims.inventory_management_system.entity.Product;
import com.ims.inventory_management_system.service.ProductService;

@Controller
public class ProductController {

    @Autowired
    private ProductService productService;

    // Home page for products
    @GetMapping("/products")
    public String viewProducts(Model model) {
        List<Product> productList = productService.getAllProducts();
        model.addAttribute("products", productList);
        return "products";
    }

    // Open Add Product Page
    @GetMapping("/addProduct")
    public String addProduct(Model model) {
        model.addAttribute("product", new Product());
        return "addProduct";
    }

    // Save Product
    @PostMapping("/saveProduct")
    public String saveProduct(@ModelAttribute Product product) {
        productService.saveProduct(product);
        return "redirect:/products";
    }

    // Edit Product
    @GetMapping("/editProduct/{id}")
    public String editProduct(@PathVariable Integer id, Model model) {

        Product product = productService.getProductById(id);

        model.addAttribute("product", product);

        return "addProduct";
    }

    // Update Product
    @PostMapping("/updateProduct")
    public String updateProduct(@ModelAttribute Product product) {

        productService.updateProduct(product);

        return "redirect:/products";
    }

    // Delete Product
    @GetMapping("/deleteProduct/{id}")
    public String deleteProduct(@PathVariable Integer id) {

        productService.deleteProduct(id);

        return "redirect:/products";
    }

    // Open Update Stock Page
    @GetMapping("/updateStock/{id}")
    public String updateStockPage(@PathVariable Integer id, Model model) {

        Product product = productService.getProductById(id);

        model.addAttribute("product", product);

        return "updateStock";
    }

    // Save Updated Stock
    @PostMapping("/updateStock")
    public String updateStock(@ModelAttribute Product product) {

        Product existingProduct = productService.getProductById(product.getProductId());

        existingProduct.setStockQuantity(product.getStockQuantity());

        productService.updateProduct(existingProduct);

        return "redirect:/products";
    }

}