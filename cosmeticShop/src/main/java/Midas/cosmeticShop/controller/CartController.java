package Midas.cosmeticshop.controller;

import Midas.cosmeticshop.dto.CartGetDTO;
import Midas.cosmeticshop.dto.CartPostDTO;
import Midas.cosmeticshop.service.CartService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/carts")
public class CartController {

    private final CartService cartService;

    public CartController (CartService cartService) {
        this.cartService = cartService;
    }

    @GetMapping("")
    public ResponseEntity<Map<String, Object>> getCarts(Authentication authentication) {
        List<CartGetDTO> cartItems = cartService.getCarts(authentication.getName());
        Map<String, Object> response = new HashMap<>();
        response.put("items", cartItems);
        return ResponseEntity.ok(response);
    }

    @PostMapping("")
    public ResponseEntity<Void> postCart(@RequestBody CartPostDTO cartPostDTO,
                                         Authentication authentication) {
        cartService.postCart(cartPostDTO, authentication.getName());
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{cartId}")
    public ResponseEntity<Void> putCart(@PathVariable Long cartId,
                                        @RequestParam("quantity") int quantity,
                                        Authentication authentication) {
        cartService.putCart(cartId, quantity, authentication.getName());
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{cartId}")
    public ResponseEntity<Void> deleteCart(@PathVariable Long cartId,
                                        Authentication authentication) {
        cartService.deleteCart(cartId, authentication.getName());
        return ResponseEntity.ok().build();
    }

}
