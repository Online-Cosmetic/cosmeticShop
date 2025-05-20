package Midas.cosmeticshop.repository;


import Midas.cosmeticshop.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByProductId(Long productId);
    List<Review> findByProductIdOrderByRatingDesc(Long productId);
    List<Review> findByContentContaining(String badKeyword);
    void deleteAllByContentContaining(String badKeyword);
}
