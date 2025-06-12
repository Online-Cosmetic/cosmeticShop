package Midas.cosmeticshop.controller;

import Midas.cosmeticshop.dto.CartGetDTO;
import Midas.cosmeticshop.dto.CartPostDTO;
import Midas.cosmeticshop.service.CartService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/carts")
public class CartController {

    private final CartService cartService;

    public CartController (CartService cartService) {
        this.cartService = cartService;
    }

    @GetMapping("")
    public ResponseEntity<Map<String, Object>> getAllCarts(Authentication authentication) {
        List<CartGetDTO> cartItems = cartService.getAllCarts(authentication.getName());

        // 디버깅을 위한 로그 추가
        log.info("사용자 {}의 장바구니 상품 {}개 조회됨", authentication.getName(), cartItems.size());
        for (CartGetDTO item : cartItems) {
            log.debug("장바구니 상품 정보: ID={}, 상품명={}, 가격={}, 할인율={}%, 수량={}개",
                item.getId(), item.getProductName(), item.getPrice(), item.getDiscountRate(), item.getQuantity());
        }

        Map<String, Object> response = new HashMap<>();
        response.put("items", cartItems);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/selected")
    public ResponseEntity<Map<String, Object>> getSeletedCarts(Authentication authentication,
                                                               @RequestBody List<Long> cartIds) {
        log.info("사용자 {}의 선택된 장바구니 상품 {}개 조회 요청", authentication.getName(), cartIds.size());
        List<CartGetDTO> cartItems = cartService.getSelectedCarts(authentication.getName(), cartIds);
        Map<String, Object> response = new HashMap<>();
        response.put("items", cartItems);
        return ResponseEntity.ok(response);
    }

    @PostMapping("")
    public ResponseEntity<Void> postCart(@RequestBody CartPostDTO cartPostDTO,
                                         Authentication authentication) {
        log.info("사용자 {}의 장바구니 상품 추가: 상품ID={}, 수량={}",
            authentication.getName(), cartPostDTO.getProductId(), cartPostDTO.getQuantity());
        cartService.postCart(cartPostDTO, authentication.getName());
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{cartId}")
    public ResponseEntity<Void> putCart(@PathVariable Long cartId,
                                        @RequestParam("quantity") int quantity,
                                        Authentication authentication) {
        log.info("사용자 {}의 장바구니 상품 수량 변경: 장바구니ID={}, 새 수량={}",
            authentication.getName(), cartId, quantity);
        cartService.putCart(cartId, quantity, authentication.getName());
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{cartId}")
    public ResponseEntity<Void> deleteCart(@PathVariable Long cartId,
                                        Authentication authentication) {
        log.info("사용자 {}의 장바구니 상품 삭제: 장바구니ID={}", authentication.getName(), cartId);
        cartService.deleteCart(cartId, authentication.getName());
        return ResponseEntity.ok().build();
    }

}
