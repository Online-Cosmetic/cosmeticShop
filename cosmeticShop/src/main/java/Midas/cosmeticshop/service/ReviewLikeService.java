package Midas.cosmeticshop.service;

import Midas.cosmeticshop.entity.Review;
import Midas.cosmeticshop.entity.ReviewLike;
import Midas.cosmeticshop.entity.user.User;
import Midas.cosmeticshop.repository.ReviewLikeRepository;
import Midas.cosmeticshop.repository.ReviewRepository;
import Midas.cosmeticshop.repository.user.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class ReviewLikeService {

    private final ReviewLikeRepository ReviewLikeRepo;
    private final UserRepository UserRepo;
    private final ReviewRepository ReviewRepo;
    private final OrderService orderService;

    public ReviewLikeService (ReviewLikeRepository ReviewLikeRepo, UserRepository UserRepo, ReviewRepository ReviewRepo, OrderService orderService) {
        this.ReviewLikeRepo = ReviewLikeRepo;
        this.UserRepo = UserRepo;
        this.ReviewRepo = ReviewRepo;
        this.orderService = orderService;
    }

    @Transactional
    public boolean toggleReviewLike (Long reviewId, String userId) {
        Optional<ReviewLike> optionalReviewLike = ReviewLikeRepo.findByReviewIdAndUserUserId(reviewId, userId);

        if(optionalReviewLike.isPresent()) {
            ReviewLikeRepo.delete(optionalReviewLike.get());
            ReviewLikeRepo.decrementLiked(reviewId);
            return false;
        }
        else {
            User user = UserRepo.findByUserId(userId)
                    .orElseThrow(() -> new EntityNotFoundException("사용자가 존재하지 않습니다."));
            Review review = ReviewRepo.findById(reviewId)
                    .orElseThrow(() -> new EntityNotFoundException("리뷰가 존재하지 않습니다."));
            ReviewLike reviewLike = new ReviewLike();
            reviewLike.setUser(user);
            reviewLike.setReview(review);
            ReviewLikeRepo.save(reviewLike);
            ReviewLikeRepo.incrementLiked(reviewId);
            return true;
        }
    }

    public Boolean checkPurchased(Long productId, String userId) {
        // 사용자가 해당 상품을 구매했는지 확인하는 로직
        // OrderRepository를 통해 사용자의 주문 내역 중 해당 상품이 있는지 확인
        return orderService.hasUserPurchasedProduct(userId, productId);
    }

    public Boolean checkReviewed(Long productId, String userId) {
        // 사용자가 해당 상품에 대해 리뷰를 작성했는지 확인하는 로직
        return ReviewRepo.existsByProductIdAndUserUserId(productId, userId);
    }
}
