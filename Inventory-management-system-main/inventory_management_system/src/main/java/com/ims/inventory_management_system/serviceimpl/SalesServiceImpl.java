package com.ims.inventory_management_system.serviceimpl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ims.inventory_management_system.entity.Sales;
import com.ims.inventory_management_system.repository.SalesRepository;
import com.ims.inventory_management_system.service.SalesService;

@Service
public class SalesServiceImpl implements SalesService{

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

}