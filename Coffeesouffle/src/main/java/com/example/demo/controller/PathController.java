package com.example.demo.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import com.example.demo.model.po.News;
import com.example.demo.service.NewsService;

@Controller
public class PathController {
	
	@Autowired
    private NewsService newsService;

	// 跳轉 /index 頁面
	@GetMapping("/index")
	public String indexPage(Model model) {
		List<News> newsList = newsService.getAllNews();
        newsList = newsList.stream().limit(3).collect(Collectors.toList());
        model.addAttribute("newsList", newsList);
		return "index";
	}
	
	// 跳轉首頁
	@GetMapping("/")
	public String index(Model model) {
		List<News> newsList = newsService.getAllNews();
        newsList = newsList.stream().limit(3).collect(Collectors.toList());
        model.addAttribute("newsList", newsList);
		return "index";
	}
	
	// 跳轉 /table 頁面
	@GetMapping("/table")
	public String tablePage() {
		
		return "table";
	}
		
	// 跳轉 /member 頁面
	@GetMapping("/member")
	public String memberPage() {
		
		return "member";
	}
	// 跳轉 /cart 頁面
		@GetMapping("/cart")
		public String cartPage() {
			
			return "cart";
		}
		

	
	
}
