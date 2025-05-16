package Midas.cosmeticshop.service;


import Midas.cosmeticshop.dto.product.ProductLikeGetDTO;
import Midas.cosmeticshop.entity.product.Product;
import Midas.cosmeticshop.entity.product.ProductLike;
import Midas.cosmeticshop.entity.user.User;
import Midas.cosmeticshop.repository.ProductLikeRepository;
import Midas.cosmeticshop.repository.ProductRepository;
import Midas.cosmeticshop.repository.user.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class ProductLikeService {

    private ProductLikeRepository ProductLikeRepo;
    private UserRepository UserRepo;
    private ProductRepository ProductRepo;
    public ProductLikeService (ProductLikeRepository ProductLikeRepo, UserRepository UserRepo, ProductRepository ProductRepo) {
        this.ProductLikeRepo = ProductLikeRepo;
        this.UserRepo = UserRepo;
        this.ProductRepo = ProductRepo;
    }

    @Transactional
    public boolean toggleProductLike(Long productId, String userId) {

        Optional<ProductLike> optionalProductLike = ProductLikeRepo.findByUserUserIdAndProductId(userId, productId);

        if(optionalProductLike.isPresent()) {
            ProductLikeRepo.delete(optionalProductLike.get());
            ProductLikeRepo.decrementLiked(productId);
            return false;
        }
        else {
            User user = UserRepo.findByUserId(userId)
                    .orElseThrow(() -> new EntityNotFoundException("사용자가 존재하지 않습니다."));
            Product product = ProductRepo.findById(productId)
                    .orElseThrow(() -> new EntityNotFoundException("상품이 존재하지 않습니다."));
            ProductLike productlike = new ProductLike();
            productlike.setProduct(product);
            productlike.setUser(user);
            productlike.setCreatedAt(LocalDateTime.now());
            ProductLikeRepo.save(productlike);
            ProductLikeRepo.incrementLiked(productId);
            return true;
        }

    }

    public List<ProductLikeGetDTO> getLikedProducts (String userId) {
        List<ProductLikeGetDTO> productLikeGetDTOList = new ArrayList<>();
        List<ProductLike> productLikeList = ProductLikeRepo.findByUserUserId(userId);
        for (ProductLike productLike : productLikeList) {
            productLikeGetDTOList.add(new ProductLikeGetDTO(productLike));
        }
        return productLikeGetDTOList;
    }

}
