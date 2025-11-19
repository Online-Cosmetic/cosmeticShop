package Midas.cosmeticshop.dto.product;

import Midas.cosmeticshop.entity.product.Product;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class ProductPreviewDTO { // 여러 상품 나와있을때 최소한의 정보들만 노출할 DTO
    private Long productId;
    private String productName;
    private String description;
    private int price;
    private int discountRate; // 할인율 필드 추가
    private String ThumbImgUrl;
    private int liked; // 찜한 사람 수
    private String companyName;

    public static ProductPreviewDTO from(Product product) {
        String imageUrl = null;
        if (product.getThumbnailImage() != null) {
            imageUrl = product.getThumbnailImage().getImageUrl();
            
            // S3 public URL로 변환
            if (imageUrl != null && imageUrl.startsWith("/images/")) {
                imageUrl = "https://cosmall-image-bucket.s3.ap-northeast-2.amazonaws.com" + imageUrl;
            }
        }

        return new ProductPreviewDTO(
            product.getId(),
            product.getProductName(),
            product.getDescription(),
            product.getPrice(),
            product.getDiscountRate(), // 할인율 값 추가
            product.getLiked(), // 찜한 사람 수 추가
            product.getDiscountRate(),
            imageUrl,
            product.getCompany().getCompanyName()
        );
    }
}
