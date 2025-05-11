package Midas.cosmeticShop.dto;

import Midas.cosmeticShop.entity.Product;
import Midas.cosmeticShop.entity.Review;
import Midas.cosmeticShop.entity.ReviewImage;
import Midas.cosmeticShop.entity.Users.User;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.cglib.core.Local;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ReviewDTO {

    private Long id;
    private User user;
    private Product product;
    private String content;
    private int rating;
    private int liked;
    private int disliked;
    private LocalDateTime createdAt;
    private LocalDateTime revisedAt;
    private List<ReviewImage> reviewImages;

    public ReviewDTO (Review review) {
        this.id = review.getId();
        this.user = review.getUser();
        this.product = review.getProduct();
        this.content = review.getContent();
        this.rating = review.getRating();
        this.liked = review.getLiked();
        this.disliked = review.getDisliked();
        this.createdAt = review.getCreatedAt();
        this.reviewImages = review.getReviewImages();
    }
}
