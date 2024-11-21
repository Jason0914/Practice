package com.example.demo.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;

import com.example.demo.model.po.Member;
import com.example.demo.service.MemberService;

import jakarta.servlet.http.HttpSession;

@Controller
public class LoginController {
	
	@Autowired
	private MemberService memberService;
	
    // 登入
    // @ResponseBody 和 @RequestBody 是用 Ajax 沒有刷新頁面時使用
	@PostMapping("/login")
	@ResponseBody
	public ResponseEntity<?> login(@RequestBody Map<String, String> map, HttpSession session) {
	    Member member = null;
	    try {
	        member = memberService.login(map.get("account"), map.get("password"));
	    } catch (Exception e) {
	        return ResponseEntity.status(500).body("伺服器錯誤");
	    }

	    if (member != null) {
	        // 設置登入狀態和會員資料到 session
	        session.setAttribute("loginStatus", true);
	        session.setAttribute("member", member);

	        // 返回跳轉 URL
	        Map<String, String> result = new HashMap<>();
	        result.put("redirectUrl", "/member_backend"); // 固定跳轉到後台
	        return ResponseEntity.ok(result);
	    }
	    return ResponseEntity.status(401).body("帳號或密碼錯誤");
	}

	
    
    // 登出
    @GetMapping("/logout")
    private String logout(HttpSession session) {
		System.out.println("登出成功");
    	session.invalidate();
    	return "redirect:/index";
    }
    
    

}
