package Midas.cosmeticshop.controller;

import Midas.cosmeticshop.dto.product.ProductLikeGetDTO;
import Midas.cosmeticshop.service.ProductLikeService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductLikeController {

    private final ProductLikeService productLikeService;

    private ProductLikeController (ProductLikeService productLikeService) {
        this.productLikeService = productLikeService;
    }

    @GetMapping("/likes")
    public ResponseEntity<List<ProductLikeGetDTO>> getLikedProducts(Authentication authentication) {
        return ResponseEntity.ok().body(productLikeService.getLikedProducts(authentication.getName()));
    }

    @PostMapping("/{productId}/likes/toggle")
    public ResponseEntity<Boolean> toggleProductLike(@PathVariable Long productId,
                                                     Authentication authentication) {
        return ResponseEntity.ok().body(productLikeService.toggleProductLike(productId, authentication.getName()));
    }

}