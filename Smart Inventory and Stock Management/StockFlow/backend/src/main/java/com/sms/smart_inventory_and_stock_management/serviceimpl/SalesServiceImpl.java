package com.sms.smart_inventory_and_stock_management.serviceimpl;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.sms.smart_inventory_and_stock_management.entity.Sales;
import com.sms.smart_inventory_and_stock_management.repository.SalesRepository;
import com.sms.smart_inventory_and_stock_management.service.SalesService;

@Service
@Transactional
public class SalesServiceImpl implements SalesService {

    @Autowired
    private SalesRepository salesRepository;

    @Override
    public Sales saveSales(Sales sales) {
        return salesRepository.save(sales);
    }

    @Override
    public List<Sales> getAllSales() {
        return salesRepository.findAll();
    }

    @Override
    public Sales getSalesById(Integer id) {
        return salesRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Sales not found with id: " + id));
    }

    @Override
    public List<Sales> getSalesByProductId(Integer productId) {
        return salesRepository.findByProductId(productId);
    }

    @Override
    public void deleteSales(Integer id) {
        salesRepository.deleteById(id);
    }
}