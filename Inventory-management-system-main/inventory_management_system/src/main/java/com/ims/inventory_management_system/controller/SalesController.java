package com.ims.inventory_management_system.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;

import com.ims.inventory_management_system.entity.Product;
import com.ims.inventory_management_system.entity.Sales;
import com.ims.inventory_management_system.service.ProductService;
import com.ims.inventory_management_system.service.SalesService;

@Controller
public class SalesController {

    @Autowired
    private SalesService salesService;

    @Autowired
    private ProductService productService;

    @GetMapping("/sales")
    public String salesPage(Model model) {

        model.addAttribute("sales", new Sales());

        model.addAttribute("products",
                productService.getAllProducts());

        model.addAttribute("salesList",
                salesService.getAllSales());

        return "sales";
    }

    @PostMapping("/saveSales")
    public String saveSales(@ModelAttribute Sales sales) {

        Product product =
                productService.getProductById(sales.getProductId());

        sales.setProductName(product.getProductName());

        sales.setTotalAmount(
                sales.getQuantitySold() *
                        sales.getSellingPrice());

        salesService.saveSales(sales);

        product.setStockQuantity(
                product.getStockQuantity() -
                        sales.getQuantitySold());

        productService.updateProduct(product);

        return "redirect:/sales";
    }

}