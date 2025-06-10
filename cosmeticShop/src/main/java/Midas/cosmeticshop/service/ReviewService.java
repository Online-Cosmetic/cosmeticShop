package Midas.cosmeticshop.service;

import Midas.cosmeticshop.dto.ReviewGetDTO;
import Midas.cosmeticshop.dto.ReviewPostDTO;
import Midas.cosmeticshop.dto.ReviewPutDTO;
import Midas.cosmeticshop.entity.Review;
import Midas.cosmeticshop.entity.ReviewImage;
import Midas.cosmeticshop.entity.product.Product;
import Midas.cosmeticshop.entity.user.User;
import Midas.cosmeticshop.repository.ProductRepository;
import Midas.cosmeticshop.repository.ReviewImageRepository;
import Midas.cosmeticshop.repository.ReviewLikeRepository;
import Midas.cosmeticshop.repository.ReviewRepository;
import Midas.cosmeticshop.repository.user.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import static java.util.Comparator.comparing;
import static java.util.Comparator.reverseOrder;

@Service
public class ReviewService {

    private final ReviewRepository ReviewRepo;
    private final ProductRepository ProductRepo;
    private final UserRepository UserRepo;
    private final ReviewImageRepository ReviewImageRepo;
    private final ReviewLikeRepository ReviewLikeRepo;
    private final FileStorageService fileStorageService;

    public ReviewService(ReviewRepository ReviewRepo, ProductRepository ProductRepo, UserRepository UserRepo, ReviewImageRepository ReviewImageRepo, ReviewLikeRepository ReviewLikeRepo, FileStorageService fileStorageService) {
        this.ReviewRepo = ReviewRepo;
        this.ProductRepo = ProductRepo;
        this.UserRepo = UserRepo;
        this.ReviewImageRepo = ReviewImageRepo;
        this.ReviewLikeRepo = ReviewLikeRepo;
        this.fileStorageService = fileStorageService;
    }

    public List<ReviewGetDTO> getReview(Long productId, String userId) {
        List<Review> reviewList = ReviewRepo.findByProductIdOrderByLikedDesc(productId);
        List<ReviewGetDTO> reviewDTOList = new ArrayList<>();

        if(userId==null) {
            for(Review review : reviewList) {
                reviewDTOList.add(new ReviewGetDTO(review, false));
            }
            return reviewDTOList;
        }

        for (Review review : reviewList) {
            if(ReviewLikeRepo.existsByReviewIdAndUserUserId(review.getId(), userId))
                reviewDTOList.add(new ReviewGetDTO(review, true));
            else
                reviewDTOList.add(new ReviewGetDTO(review, false));
        }
        reviewDTOList.sort(
            comparing(ReviewGetDTO::isLiked).reversed()
                .thenComparing(ReviewGetDTO::getLiked, reverseOrder())
                .thenComparing(ReviewGetDTO::getCreatedAt, reverseOrder())
        );
        return reviewDTOList;
    }

    public List<ReviewGetDTO> getAllMyReviews(String userId) {
        List<Review> reviewList = ReviewRepo.findByUserUserId(userId);
        List<ReviewGetDTO> reviewGetDTOList = new ArrayList<>();
        for(Review review : reviewList) {
            boolean isLiked = ReviewLikeRepo.existsByReviewIdAndUserUserId(review.getId(), userId);
            reviewGetDTOList.add(new ReviewGetDTO(review, isLiked));
        }
        return reviewGetDTOList;
    }

    public List<ReviewGetDTO> getMyReview(Long productId, String userId) {
        List<Review> reviewList = ReviewRepo.findByProductIdAndUserUserId(productId, userId);
        List<ReviewGetDTO> reviewGetDTOList = new ArrayList<>();
        for(Review review : reviewList) {
            reviewGetDTOList.add(new ReviewGetDTO(review, false));
        }
        return reviewGetDTOList;
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

    @Transactional
    public void deleteReview(Long reviewId, String userId) {
        Review review = ReviewRepo.findById(reviewId)
                        .orElseThrow(() -> new EntityNotFoundException("리뷰가 존재하지 않습니다."));
        if(!review.getUser().getUserId().equals(userId))
            throw new AccessDeniedException("본인이 작성한 리뷰만 삭제할 수 있습니다.");
        
        // 먼저 리뷰와 관련된 좋아요 데이터를 삭제
        ReviewLikeRepo.deleteAllByReviewId(reviewId);
        
        // 리뷰 이미지 삭제
        ReviewImageRepo.deleteAllByReviewId(reviewId);
        
        // 마지막으로 리뷰 삭제
        ReviewRepo.delete(review);
    }

    public List<String> saveImages(List<MultipartFile> images) {
        List<String> imageUrls = new ArrayList<>();
        for (MultipartFile image : images) {
            if (!image.isEmpty()) {
                String imageUrl = fileStorageService.storeFile(image);
                imageUrls.add(imageUrl);
            }
        }
        return imageUrls;
    }
}