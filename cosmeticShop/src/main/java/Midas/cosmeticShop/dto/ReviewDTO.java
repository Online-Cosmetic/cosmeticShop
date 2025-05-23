package Midas.cosmeticshop.dto;

import Midas.cosmeticshop.entity.product.Product;
import Midas.cosmeticshop.entity.Review;
import Midas.cosmeticshop.entity.ReviewImage;
import Midas.cosmeticshop.entity.user.User;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ReviewDTO {

    private Long id;
    private String nickname;
    private Long productId;
    private String content;
    private int rating;
    private int liked;
    private int disliked;
    private LocalDateTime createdAt;
    private LocalDateTime revisedAt;
    private List<String> reviewImageUrls;

    public ReviewDTO(Review review) {
        this.id = review.getId();
        this.nickname = review.getUser().getNickName();
        this.productId = review.getProduct().getId();
        this.content = review.getContent();
        this.rating = review.getRating();
        this.liked = review.getLiked();
        this.disliked = review.getDisliked();
        this.createdAt = review.getCreatedAt();
        this.revisedAt = review.getRevisedAt();
        this.reviewImageUrls = review.getReviewImages() != null ?
            review.getReviewImages().stream().map(img -> img.getImageUrl()).toList() : null;
    }

    public static Review toEntity(ReviewDTO dto, User user, Product product, List<ReviewImage> reviewImages) {
        Review review = new Review();
        review.setUser(user);
        review.setProduct(product);
        review.setContent(dto.getContent());
        review.setRating(dto.getRating());
        review.setLiked(dto.getLiked());
        review.setDisliked(dto.getDisliked());
        review.setCreatedAt(dto.getCreatedAt());
        review.setRevisedAt(dto.getRevisedAt());
        review.setReviewImages(reviewImages);
        return review;
    }
}
