package com.ims.inventory_management_system.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;

import com.ims.inventory_management_system.entity.Product;
import com.ims.inventory_management_system.entity.Purchase;
import com.ims.inventory_management_system.service.ProductService;
import com.ims.inventory_management_system.service.PurchaseService;

@Controller
public class PurchaseController {

    @Autowired
    private PurchaseService purchaseService;

    @Autowired
    private ProductService productService;

    @GetMapping("/purchase")
    public String purchasePage(Model model) {

        model.addAttribute("purchase", new Purchase());

        model.addAttribute("products", productService.getAllProducts());

        model.addAttribute("purchaseList",
                purchaseService.getAllPurchases());

        return "purchase";
    }

    @PostMapping("/savePurchase")
    public String savePurchase(@ModelAttribute Purchase purchase) {

        Product product =
                productService.getProductById(purchase.getProductId());

        purchase.setProductName(product.getProductName());

        purchase.setTotalCost(
                purchase.getQuantity() *
                        purchase.getPurchasePrice());

        purchaseService.savePurchase(purchase);

        product.setStockQuantity(
                product.getStockQuantity() +
                        purchase.getQuantity());

        productService.updateProduct(product);

        return "redirect:/purchase";
    }

}