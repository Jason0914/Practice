package com.example.demo.dao;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.model.dto.OrderDto;
import com.example.demo.model.dto.OrderItemDto;
import com.example.demo.model.po.Order;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;

//OrderDao 的實現類，使用 JDBC 來執行資料庫操作
@Repository
public class OrderDaoImpl implements OrderDao {
	
	@Autowired
	private JdbcTemplate jdbcTemplate;
	
	// 查詢所有
	@Override
	public List<Order> findAllOrder() {
		String sql = "SELECT order_id, table_number, order_time, total_price"
		           + " FROM orders"
		           + " ORDER BY order_id DESC";
	    		
	    		//+ "JOIN order_items ON orders.order_id = order_items.order_id"; 
	    
	    return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(Order.class));
	}

	// 根據 ID 單筆查詢，查不到會有 DataAccess 例外
	@Override
	public Order findOrderById(Integer orderId) {
	    String sql = "SELECT order_id, table_number, order_time, total_price FROM orders WHERE order_id = ?";
	    try {
	        return jdbcTemplate.queryForObject(sql, new BeanPropertyRowMapper<>(Order.class), orderId);
	    } catch (Exception e) {
	        e.printStackTrace();
	        return null;
	    }
	}

//	@Override
//	public Order findOrderById(Integer orderId) {
//		String sql = "SELECT order_id, order_name, quantity, price FROM order_items WHERE order_id = ?";
//		try {
//			return jdbcTemplate.queryForObject(sql, new BeanPropertyRowMapper<>(Order.class), orderId);
//		} catch (Exception e) {
//			e.printStackTrace();
//			return null;
//		}
//	}


	// 新增 Order
    @Override
    public int createOrder(OrderDto orderDto) {
        String sql = "INSERT INTO orders (table_number, total_price, order_time) VALUES (?, ?, ?)";
        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setInt(1, orderDto.getTableNumber());
            ps.setInt(2, orderDto.getTotalPrice());
            ps.setTimestamp(3, new java.sql.Timestamp(orderDto.getOrderTime().getTime()));
            return ps;
        }, keyHolder);

        return keyHolder.getKey().intValue();
    }

    // 新增 Order 明細
    @Override
    public void createOrderItem(Integer orderId, OrderItemDto orderItemDto) {
        String sql = "INSERT INTO order_items (order_id, order_name, quantity, price) VALUES (?, ?, ?, ?)";
        jdbcTemplate.update(sql, orderId, orderItemDto.getOrderName(), orderItemDto.getQuantity(), orderItemDto.getPrice());
    }

    
	
	// 刪除
    @Transactional
    @Override
    public int deleteOrder(Integer orderId) {
        // 刪除 order_items 中的記錄
        String deleteOrderItemsSql = "DELETE FROM order_items WHERE order_id = ?";
        jdbcTemplate.update(deleteOrderItemsSql, orderId);

        // 刪除 orders 中的記錄
        String deleteOrderSql = "DELETE FROM orders WHERE order_id = ?";
        return jdbcTemplate.update(deleteOrderSql, orderId);
    }
    
 // OrderDaoImpl.java
    @Override
    public List<Order> findOrdersByTableNumber(Integer tableNumber) {
        String sql = "SELECT order_id, table_number, order_time, total_price FROM orders WHERE table_number = ?";
        return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(Order.class), tableNumber);
    }

    // ===================
    // 新增的 session_id 功能
    // ===================

    /**
     * 根據 session_id 查詢訂單
     */
    @Override
    public List<Order> findOrdersBySessionId(String sessionId) {
        String sql = "SELECT o.* FROM orders o " +
                     "JOIN customers c ON o.customer_id = c.id " +
                     "WHERE c.session_id = ?";
        try {
            return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(Order.class), sessionId);
        } catch (Exception e) {
            e.printStackTrace();
            return List.of(); // 返回空列表以防止系統崩潰
        }
    }

    /**
     * 更新訂單的 customer_id
     */
    @Override
    public void updateOrderCustomer(Integer orderId, Integer customerId) {
        String sql = "UPDATE orders SET customer_id = ? WHERE order_id = ?";
        int rowsUpdated = jdbcTemplate.update(sql, customerId, orderId);

        if (rowsUpdated == 0) {
            System.err.println("更新訂單的 customer_id 失敗，orderId: " + orderId);
        }
    }
}
