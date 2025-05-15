package Midas.cosmeticShop.service;

import Midas.cosmeticShop.entity.ProductLike;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class ProductLikeService {

    public Void postProductLike(Long productId, String userId) {
        ProductLike productLike = new ProductLike();
        productLike.setUser();
        productLike.setProduct();
        productLike.setCreatedAt(LocalDateTime.now());
        ProductLikeRepository.save(productLike);
    }
}
