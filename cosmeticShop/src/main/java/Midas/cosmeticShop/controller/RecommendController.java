package Midas.cosmeticshop.controller;

import Midas.cosmeticshop.service.RecommendService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/recommend")
@RequiredArgsConstructor
public class RecommendController {

    private final RecommendService recommendService;

    @GetMapping
    public ResponseEntity<List<ProductPreviewDTO>> getRecommendBySales (Authentication authentication) {
        return ResponseEntity.ok().body(recommendService.getRecommendBySales(authentication.getName()));
    }

    @GetMapping
    public ResponseEntity<List<ProductPreviewDTO>> getRecommendByCompany (@RequestParam("companyId") Long companyId, Authentication authentication) {
        return ResponseEntity.ok().body(recommendService.getRecommendByCompany(authentication.getName(), companyId));
    }

    @GetMapping
    public ResponseEntity<List<ProductPreviewDTO>> getRecommendByCategory (@RequestParam("categoryId") Long categoryId, Authentication authentication) {
        return ResponseEntity.ok().body(recommendService.getRecommendByCategory(authentication.getName(), categoryId));
    }

}
