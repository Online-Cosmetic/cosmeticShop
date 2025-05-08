package Midas.cosmeticShop.service;

import Midas.cosmeticShop.dto.CartGetDTO;
import Midas.cosmeticShop.dto.CartPostDTO;
import Midas.cosmeticShop.entity.Cart;
import Midas.cosmeticShop.entity.Product;
import Midas.cosmeticShop.entity.ProductOption;
import Midas.cosmeticShop.entity.Users.User;
import Midas.cosmeticShop.repository.CartRepository;
import Midas.cosmeticShop.repository.ProductOptionRepository;
import Midas.cosmeticShop.repository.ProductRepository;
import Midas.cosmeticShop.repository.Users.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class CartService {

    private final CartRepository CartRepo;
    private final UserRepository UserRepo;
    private final ProductRepository ProductRepo;
    private final ProductOptionRepository ProductOptionRepo;

    public CartService (CartRepository CartRepo, UserRepository UserRepo, ProductRepository ProductRepo, ProductOptionRepository ProductOptionRepo) {
        this.CartRepo = CartRepo;
        this.UserRepo = UserRepo;
        this.ProductRepo = ProductRepo;
        this.ProductOptionRepo = ProductOptionRepo;
    }

    public List<CartGetDTO> getCarts(String userId) {
        User user = UserRepo.findByUserId(userId)
                .orElseThrow(() -> new EntityNotFoundException("사용자가 존재하지 않습니다."));
        List<Cart> cartList = CartRepo.findByUserId(user.getId());
        List<CartGetDTO> cartGetDTOList = new ArrayList<>();
        for (Cart cart : cartList) {
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
        ProductOption productOption = ProductOptionRepo.findById(cartPostDTO.getProductOptionId())
                .orElseThrow(() -> new EntityNotFoundException("상품 옵션이 존재하지 않습니다."));
        cart.setProductOption(productOption);
        cart.setQuantity(cartPostDTO.getQuantity());
        CartRepo.save(cart);
    }

    public void putCart(Long cartId, int quantity, String userId) {
        if (!UserRepo.existsByUserId(userId))
            throw new EntityNotFoundException("사용자가 존재하지 않습니다");
        Cart cart = CartRepo.findById(cartId)
                .orElseThrow(() -> new EntityNotFoundException("장바구니가 존재하지 않습니다."));
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
