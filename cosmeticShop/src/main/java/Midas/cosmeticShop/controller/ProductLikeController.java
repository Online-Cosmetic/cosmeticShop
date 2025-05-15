package Midas.cosmeticShop.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/products")
public class ProductLikeController {

    @GetMapping("/likes")
    public ResponseEntity<List<ProductLikeGetDTO>> getLikes(Authentication authentication) {
        
    }

    @PostMapping("/{productId}/likes")
    public ResponseEntity<Void> postLike(@PathVariable Long productId,
                                         Authentication authentication) {

    }

    @DeleteMapping("/{productId}/likes")
    public ResponseEntity<Void> deleteLike(@PathVariable Long productId,
                                           Authentication authentication) {

    }
}
