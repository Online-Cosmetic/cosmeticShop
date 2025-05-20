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

    public ReviewLikeService (ReviewLikeRepository ReviewLikeRepo, UserRepository UserRepo, ReviewRepository ReviewRepo) {
        this.ReviewLikeRepo = ReviewLikeRepo;
        this.UserRepo = UserRepo;
        this.ReviewRepo = ReviewRepo;
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
}
