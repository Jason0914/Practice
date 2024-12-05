package com.example.demo.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.example.demo.model.dto.OrderDto;
import com.example.demo.model.po.Order;
import com.example.demo.model.po.OrderItem;
import com.example.demo.service.OrderService;

@Controller
public class OrderController {

    @Autowired
    private OrderService orderService;

    // 將資料傳到 order_backend
    @GetMapping("/order_backend")
    public String getAllOrder(Model model) {
        List<Order> orderList = orderService.getAllOrder();
        model.addAttribute("orderList", orderList);

        List<OrderItem> orderItemsList = orderService.getAllOrderItem();
        model.addAttribute("orderItemList", orderItemsList);

        return "order_backend";
    }

    // 根據 orderId 單筆查詢
    @GetMapping("/order_backend/{orderId}")
    @ResponseBody
    public List<OrderItem> getOrderItem(@PathVariable("orderId") Integer orderId) {
        return orderService.getOrderItemById(orderId);
    }

    // 新增 order
    @PostMapping("/order_backend/")
    @ResponseBody
    public void createOrder(@RequestBody OrderDto orderDto) {
        orderService.createOrder(orderDto);
    }

    // 刪除 order
    @DeleteMapping("/order_backend/{orderId}")
    public String deleteOrder(@PathVariable("orderId") Integer orderId, Model model) throws Exception {
        System.out.println("刪除成功，ID為：" + orderId);
        orderService.deleteOrder(orderId);
        List<Order> orderList = orderService.getAllOrder();
        model.addAttribute("orderList", orderList);
        Thread.sleep(1300); // 1.3秒後再跳轉
        return "order_backend";
    }
  
 // OrderController.java
    @GetMapping("/orders/table/{tableNumber}")
    @ResponseBody
    public List<Order> getOrdersByTable(@PathVariable("tableNumber") Integer tableNumber) {
        return orderService.getOrdersByTableNumber(tableNumber);
    }
    
 // 2. 為 table.jsp 新增接口
    


    // 明細按鈕的接口
    @GetMapping("/table/orders/details/{orderId}")
    @ResponseBody
    public Map<String, Object> getOrderDetailsForTable(@PathVariable("orderId") Integer orderId) {
        Map<String, Object> response = new HashMap<>();
        try {
            // 查詢訂單基本信息
            Order order = orderService.getOrderById(orderId);
            if (order == null) {
                throw new IllegalArgumentException("無法找到指定的訂單，ID：" + orderId);
            }

            // 查詢訂單項目
            List<OrderItem> orderItems = orderService.getOrderItemById(orderId);
            if (orderItems == null || orderItems.isEmpty()) {
                throw new IllegalArgumentException("訂單項目為空，ID：" + orderId);
            }

            // 組裝返回結果
            response.put("order", order);
            response.put("items", orderItems);
            return response;

        } catch (IllegalArgumentException e) {
            System.err.println("查詢訂單明細失敗：" + e.getMessage());
            throw new RuntimeException(e.getMessage());
        } catch (Exception e) {
            System.err.println("服務器發生錯誤：" + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("服務器處理失敗，請稍後重試");
        }
    }




    // 刪除按鈕的接口
    @DeleteMapping("/table/orders/delete/{orderId}")
    @ResponseBody
    public ResponseEntity<Void> deleteOrderForTable(@PathVariable("orderId") Integer orderId) {
        orderService.deleteOrder(orderId);
        return ResponseEntity.noContent().build(); // 返回 HTTP 204 No Content
    }
}



    




