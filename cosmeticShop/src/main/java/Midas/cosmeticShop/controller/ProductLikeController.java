package Midas.cosmeticShop.controller;

import Midas.cosmeticShop.dto.Product.ProductLikeGetDTO;
import Midas.cosmeticShop.service.ProductLikeService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductLikeController {

    private ProductLikeService productLikeService;

    private ProductLikeController (ProductLikeService productLikeService) {
        this.productLikeService = productLikeService;
    }

    @GetMapping("/likes")
    public ResponseEntity<List<ProductLikeGetDTO>> getLikedProducts(Authentication authentication) {
        return ResponseEntity.ok().body(productLikeService.getLikedProducts(authentication.getName()));
    }

    @PostMapping("/{productId}/likes/toggle")
    public ResponseEntity<Boolean> postLike(@PathVariable Long productId,
                                         Authentication authentication) {
        return ResponseEntity.ok().body(productLikeService.toggleProductLike(productId, authentication.getName()));
    }

}
