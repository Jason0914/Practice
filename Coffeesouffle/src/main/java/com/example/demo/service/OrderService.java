package com.example.demo.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.dao.CustomerDao;
import com.example.demo.dao.OrderDao;
import com.example.demo.dao.OrderItemDao;
import com.example.demo.model.dto.OrderDto;
import com.example.demo.model.dto.OrderItemDto;
import com.example.demo.model.po.Order;
import com.example.demo.model.po.OrderItem;


@Service
public class OrderService {
	
	@Autowired
	private OrderDao orderDao;
	
	@Autowired
	private OrderItemDao orderItemDao;
	
	@Autowired
    private CustomerDao CustomerDao; // 注入 CustomerDao
	
	// 取得多筆 Order
	public List<Order> getAllOrder() {
		return orderDao.findAllOrder();
	}
	
	//取得多筆 OrderItem
	public List<OrderItem> getAllOrderItem() {
		return orderItemDao.fintAllOrderItem();
	}
	
	
    // 取得單筆 Order
    public Order findOrderById(Integer orderId) {
        return orderDao.findOrderById(orderId);
    }

    // 取得多筆 OrderItems
    public List<OrderItem> getOrderItemById(Integer orderId) {
        return orderItemDao.findOrderItemById(orderId);
    }

	
	// 取得單筆 order
	public Order getOrderById(Integer orderId) {
		return orderDao.findOrderById(orderId);
	}
	
	
	// 新增 order
	// @Transactional 失敗的話會 Roll Back
	@Transactional
    public void createOrder(OrderDto orderDto) {
        // Insert order and get generated order_id
        int orderId = orderDao.createOrder(orderDto);

        // Insert order items
        for (OrderItemDto item : orderDto.getItems()) {
            orderDao.createOrderItem(orderId, item);
        }
    }
	
	
	// 刪除 order
	@Transactional
    public void deleteOrder(Integer orderId) {
        orderDao.deleteOrder(orderId);
    }
	// OrderService.java
	public List<Order> getOrdersByTableNumber(Integer tableNumber) {
	    return orderDao.findOrdersByTableNumber(tableNumber);
	}

    // ===================
    // 新增 session_id 相關功能
    // ===================

    /**
     * 根據 session_id 查詢客戶訂單
     */
    @Transactional
    public List<Order> getOrdersBySession(String sessionId) {
        return orderDao.findOrdersBySessionId(sessionId);
    }

    /**
     * 根據 session_id 創建訂單
     */
    @Transactional
    public void createOrderWithSession(String sessionId, OrderDto orderDto) {
        // 確保客戶存在或新增客戶
        int customerId = CustomerDao.findOrCreateCustomerBySessionId(sessionId);

        // 新增訂單並關聯客戶
        int orderId = orderDao.createOrder(orderDto);
        orderDao.updateOrderCustomer(orderId, customerId);

        // 新增訂單項目
        for (OrderItemDto item : orderDto.getItems()) {
            orderDao.createOrderItem(orderId, item);
        }
    }
}