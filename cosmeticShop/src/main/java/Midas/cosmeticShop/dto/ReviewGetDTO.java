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
public class ReviewGetDTO {

    private Long id;
    private User user;
    private Product product;
    private String content;
    private int rating;
    private int liked;
    //private int disliked;
    private LocalDateTime createdAt;
    private LocalDateTime revisedAt;
    private List<ReviewImage> reviewImages;
    private boolean isLiked;

    public ReviewGetDTO(Review review, boolean isLiked) {
        this.id = review.getId();
        this.user = review.getUser();
        this.product = review.getProduct();
        this.content = review.getContent();
        this.rating = review.getRating();
        this.liked = review.getLiked();
        //this.disliked = review.getDisliked();
        this.createdAt = review.getCreatedAt();
        this.reviewImages = review.getReviewImages();
        this.isLiked = isLiked;
    }
}
