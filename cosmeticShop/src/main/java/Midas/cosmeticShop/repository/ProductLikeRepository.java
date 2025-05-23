package Midas.cosmeticshop.repository;

import Midas.cosmeticshop.entity.product.ProductLike;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ProductLikeRepository extends JpaRepository<ProductLike, Long> {
    @Transactional
    @Modifying
    @Query("UPDATE Product p Set p.liked = p.liked + 1 WHERE p.id = :productId")
    void incrementLiked(@Param("productId")Long productId);

    @Transactional
    @Modifying
    @Query("UPDATE Product p Set p.liked = p.liked - 1 WHERE p.id = :productId")
    void decrementLiked(@Param("productId") Long productId);

    Optional<ProductLike> findByUserUserIdAndProductId(String userId, Long productId);
    List<ProductLike> findByUserUserId(String userId);
}
