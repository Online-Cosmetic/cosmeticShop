package Midas.cosmeticshop.service;

import Midas.cosmeticshop.dto.ReviewDTO;
import Midas.cosmeticshop.dto.ReviewPostDTO;
import Midas.cosmeticshop.dto.ReviewPutDTO;
import Midas.cosmeticshop.entity.product.Product;
import Midas.cosmeticshop.entity.Review;
import Midas.cosmeticshop.entity.ReviewImage;
import Midas.cosmeticshop.entity.user.User;
import Midas.cosmeticshop.repository.ProductRepository;
import Midas.cosmeticshop.repository.ReviewImageRepository;
import Midas.cosmeticshop.repository.ReviewRepository;
import Midas.cosmeticshop.repository.user.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class ReviewService {

    private final ReviewRepository ReviewRepo;
    private final ProductRepository ProductRepo;
    private final UserRepository UserRepo;
    private final ReviewImageRepository ReviewImageRepo;

    public ReviewService(ReviewRepository ReviewRepo, ProductRepository ProductRepo, UserRepository UserRepo, ReviewImageRepository ReviewImageRepo) {
        this.ReviewRepo = ReviewRepo;
        this.ProductRepo = ProductRepo;
        this.UserRepo = UserRepo;
        this.ReviewImageRepo = ReviewImageRepo;
    }

    public List<ReviewDTO> getReview(Long productId) {
        List<Review> reviewList = ReviewRepo.findByProductIdOrderByRatingDesc(productId);
        List<ReviewDTO> reviewDTOList = new ArrayList<>();
        for (Review review : reviewList) {
            reviewDTOList.add(new ReviewDTO(review));
        }
        return reviewDTOList;
    }

    public void postReview(ReviewPostDTO reviewPostDTO, String userId) {
        Review review = new Review();
        User user = UserRepo.findByUserId(userId)
                .orElseThrow(() -> new EntityNotFoundException("사용자가 존재하지 않습니다."));
        Product product = ProductRepo.findById(reviewPostDTO.getProductId())
                        .orElseThrow(() -> new EntityNotFoundException("상품이 존재하지 않습니다."));
        review.setUser(user);
        review.setProduct(product);
        review.setContent(reviewPostDTO.getContent());
        review.setRating(reviewPostDTO.getRating());
        review.setCreatedAt(LocalDateTime.now());
        ReviewRepo.save(review);
        for(String imageUrl : reviewPostDTO.getImageUrls()) {
            ReviewImage reviewImage = new ReviewImage();
            reviewImage.setReview(review);
            reviewImage.setImageUrl(imageUrl);
            review.getReviewImages().add(reviewImage);
            ReviewImageRepo.save(reviewImage);
        }
    }

    public void putReview(Long reviewId, ReviewPutDTO reviewPutDTO, String userId) {
        Review review = ReviewRepo.findById(reviewId)
                .orElseThrow(() -> new EntityNotFoundException("리뷰가 존재하지 않습니다."));
        if(!review.getUser().getUserId().equals(userId))
            throw new AccessDeniedException("본인이 작성한 리뷰만 수정할 수 있습니다.");
        review.setContent(reviewPutDTO.getContent());
        review.setRevisedAt(LocalDateTime.now());
        ReviewRepo.save(review);
    }

    public void deleteReview(Long reviewId, String userId) {
        Review review = ReviewRepo.findById(reviewId)
                        .orElseThrow(() -> new EntityNotFoundException("리뷰가 존재하지 않습니다."));
        if(!review.getUser().getUserId().equals(userId))
            throw new AccessDeniedException("본인이 작성한 리뷰만 삭제할 수 있습니다.");
        ReviewRepo.delete(review);
    }
}
