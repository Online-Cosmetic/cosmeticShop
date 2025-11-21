package Midas.cosmeticshop.repository;


import Midas.cosmeticshop.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByUserUserId(String userUserId);
    List<Review> findByProductId(Long productId);
    List<Review> findByProductIdOrderByLikedDesc(Long productId);
    List<Review> findByProductIdOrderByCreatedAtDesc(Long productId); // 최신순 정렬 추가
    List<Review> findByContentContaining(String badKeyword);
    List<Review> findByProductIdAndUserUserId(Long productId, String userId);
    void deleteAllByContentContaining(String badKeyword);

    Boolean existsByProductIdAndUserUserId(Long productId, String userUserId);

    // AiTEMS용: 모든 리뷰 조회 (User와 Product를 함께 로드)
    @Query("SELECT r FROM Review r JOIN FETCH r.user JOIN FETCH r.product")
    List<Review> findAllReviewsForAitems();
}
