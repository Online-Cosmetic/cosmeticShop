package Midas.cosmeticshop.service;

import Midas.cosmeticshop.dto.CartGetDTO;
import Midas.cosmeticshop.dto.CartPostDTO;
import Midas.cosmeticshop.entity.Cart;
import Midas.cosmeticshop.entity.product.Product;
import Midas.cosmeticshop.entity.user.User;
import Midas.cosmeticshop.repository.CartRepository;
import Midas.cosmeticshop.repository.ProductRepository;
import Midas.cosmeticshop.repository.user.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class CartService {

    private final CartRepository CartRepo;
    private final UserRepository UserRepo;
    private final ProductRepository ProductRepo;

    public CartService (CartRepository CartRepo, UserRepository UserRepo, ProductRepository ProductRepo) {
        this.CartRepo = CartRepo;
        this.UserRepo = UserRepo;
        this.ProductRepo = ProductRepo;
    }

    public List<CartGetDTO> getAllCarts(String userId) {
        User user = UserRepo.findByUserId(userId)
                .orElseThrow(() -> new EntityNotFoundException("사용자가 존재하지 않습니다."));
        List<Cart> cartList = CartRepo.findByUserId(user.getId());
        List<CartGetDTO> cartGetDTOList = new ArrayList<>();
        for (Cart cart : cartList) {
            cartGetDTOList.add(new CartGetDTO(cart));
        }
        return cartGetDTOList;
    }

    public List<CartGetDTO> getSelectedCarts(String userId, List<Long> cartIds) {
        User user = UserRepo.findByUserId(userId)
            .orElseThrow(() -> new EntityNotFoundException("사용자가 존재하지 않습니다."));

        List<Cart> allCarts = CartRepo.findByUserId(user.getId());
        List<Cart> selectedCarts = allCarts.stream()
            .filter(cart -> cartIds.contains(cart.getId()))
            .toList();

        List<CartGetDTO> cartGetDTOList = new ArrayList<>();
        for (Cart cart : selectedCarts) {
            cartGetDTOList.add(new CartGetDTO(cart));
        }
        return cartGetDTOList;
    }

    public void postCart(CartPostDTO cartPostDTO, String userId) {
        User user = UserRepo.findByUserId(userId)
                .orElseThrow(() -> new EntityNotFoundException("사용자가 존재하지 않습니다."));
        Cart cart = new Cart();
        cart.setUser(user);
        Product product = ProductRepo.findById(cartPostDTO.getProductId())
                        .orElseThrow(() -> new EntityNotFoundException("상품이 존재하지 않습니다."));
        cart.setProduct(product);
        cart.setQuantity(cartPostDTO.getQuantity());
        CartRepo.save(cart);
    }

    public void putCart(Long cartId, int quantity, String userId) {
        if (!UserRepo.existsByUserId(userId))
            throw new EntityNotFoundException("사용자가 존재하지 않습니다");
        Cart cart = CartRepo.findById(cartId)
                .orElseThrow(() -> new EntityNotFoundException("장바구니가 존재하지 않습니다."));
        
        // 재고 확인
        Product product = cart.getProduct();
        if (product.getStock() < quantity) {
            throw new RuntimeException("재고가 부족합니다. 상품: " + product.getProductName() + ", 현재 재고: " + product.getStock());
        }
        
        cart.setQuantity(quantity);
        CartRepo.save(cart);
    }

    public void deleteCart(Long cartId, String userId) {
        if (!UserRepo.existsByUserId(userId))
            throw new EntityNotFoundException("사용자가 존재하지 않습니다");
        Cart cart = CartRepo.findById(cartId)
                .orElseThrow(() -> new EntityNotFoundException("장바구니가 존재하지 않습니다."));
        CartRepo.delete(cart);
    }
}
