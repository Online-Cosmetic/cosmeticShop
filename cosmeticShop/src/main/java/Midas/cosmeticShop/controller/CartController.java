package Midas.cosmeticShop.controller;

import Midas.cosmeticShop.dto.CartGetDTO;
import Midas.cosmeticShop.dto.CartPostDTO;
import Midas.cosmeticShop.service.CartService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class CartController {

    private final CartService cartService;

    public CartController (CartService cartService) {
        this.cartService = cartService;
    }

    @GetMapping("/carts")
    public ResponseEntity<List<CartGetDTO>> getCarts(Authentication authentication) {
        return ResponseEntity.ok().body(cartService.getCarts(authentication.getName()));
    }

    @PostMapping("/carts")
    public ResponseEntity<Void> postCart(@RequestBody CartPostDTO cartPostDTO, Authentication authentication) {
        cartService.postCart(cartPostDTO, authentication.getName());
        return ResponseEntity.ok().build();
    }

    @PutMapping("/carts/{cartId}")
    public ResponseEntity<Void> putCart(@PathVariable Long cartId, @RequestParam("quantity") int quantity, Authentication authentication) {
        cartService.putCart(cartId, quantity, authentication.getName());
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/carts/{cartId}")
    public ResponseEntity<Void> putCart(@PathVariable Long cartId, Authentication authentication) {
        cartService.deleteCart(cartId, authentication.getName());
        return ResponseEntity.ok().build();
    }

}
