package Midas.cosmeticshop.dto;

import Midas.cosmeticshop.entity.Review;
import Midas.cosmeticshop.entity.ReviewImage;
import Midas.cosmeticshop.entity.product.Product;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ReviewGetDTO {

    private Long id;
    private UserSimpleDTO user;
    private ProductSimpleDTO product;
    private String content;
    private int rating;
    private int liked;
    private LocalDateTime createdAt;
    private LocalDateTime revisedAt;
    private List<ReviewImageDTO> reviewImages;
    private boolean isLiked;

    public ReviewGetDTO(Review review, boolean isLiked) {
        this.id = review.getId();
        this.user = new UserSimpleDTO(review.getUser().getId(), review.getUser().getNickName());
        this.product = new ProductSimpleDTO(review.getProduct());
        this.content = review.getContent();
        this.rating = review.getRating();
        this.liked = review.getLiked();
        this.createdAt = review.getCreatedAt();
        this.revisedAt = review.getRevisedAt();
        this.reviewImages = review.getReviewImages().stream()
                .map(ReviewImageDTO::new)
                .collect(Collectors.toList());
        this.isLiked = isLiked;
    }

    // 명시적인 isLiked() 메소드 추가
    public boolean isLiked() {
        return this.isLiked;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserSimpleDTO {
        private Long id;
        private String nickName;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    public static class ProductSimpleDTO {
        private Long productId;
        private String productName;
        private String thumbnailImageUrl;
        private String description;
        private int price;
        private int discountRate;

        public ProductSimpleDTO(Product product) {
            this.productId = product.getId();
            this.productName = product.getProductName();
            this.thumbnailImageUrl = product.getThumbnailImage() != null ? product.getThumbnailImage().getImageUrl() : null;
            this.description = product.getDescription();
            this.price = product.getPrice();
            this.discountRate = product.getDiscountRate();
        }
    }

    @Getter
    @Setter
    @NoArgsConstructor
    public static class ReviewImageDTO {
        private Long id;
        private String imageUrl;

        public ReviewImageDTO(ReviewImage reviewImage) {
            this.id = reviewImage.getId();
            this.imageUrl = reviewImage.getImageUrl();
        }
    }
}