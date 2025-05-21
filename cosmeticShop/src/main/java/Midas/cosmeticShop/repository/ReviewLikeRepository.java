package Midas.cosmeticshop.repository;

import Midas.cosmeticshop.entity.ReviewLike;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Example;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface ReviewLikeRepository extends JpaRepository<ReviewLike, Long> {

    @Transactional
    @Modifying
    @Query("UPDATE Review r Set r.liked = r.liked + 1 WHERE r.id = :reviewId")
    void incrementLiked (@Param("reviewId") Long reviewId);

    @Transactional
    @Modifying
    @Query("UPDATE Review r Set r.liked = r.liked - 1 WHERE r.id = :reviewId")
    void decrementLiked (@Param("reviewId") Long reviewId);

    Optional<ReviewLike> findByReviewIdAndUserUserId (Long ReviewId, String UserId);

    boolean existsByReviewIdAndUserUserId(Long reviewId, String userId);
}
