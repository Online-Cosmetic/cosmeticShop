package Midas.cosmeticshop.dto.product;

import Midas.cosmeticshop.entity.product.Product;
import lombok.*;


@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class ProductDTO {
    private Long productId;
    private int categoryId;
    private String productName;
    private String description;
    private int price;
    private int discountRate; // 할인율 필드 추가
    private int stock;
    private Long companyId;
    private String companyName;
    private String thumbnailImageUrl;
    private int liked; // 찜한 사람 수


    public static ProductDTO from(Product product) {
        String thumbnailImageUrl = null;
        if (product.getThumbnailImage() != null) {
            thumbnailImageUrl = product.getThumbnailImage().getImageUrl();
            
            // S3 public URL로 변환
            if (thumbnailImageUrl != null && thumbnailImageUrl.startsWith("/images/")) {
                thumbnailImageUrl = "https://cosmall-image-bucket.s3.ap-northeast-2.amazonaws.com" + thumbnailImageUrl;
            }
        }

        return new ProductDTO(
            product.getId(),
            product.getCategoryId(),
            product.getProductName(),
            product.getDescription(),
            product.getPrice(),
            product.getDiscountRate(), // 할인율 값 추가
            product.getStock(),
            product.getCompany().getId(),
            product.getCompany().getCompanyName(),
            thumbnailImageUrl,
            product.getLiked() // 찜한 사람 수 추가
        );
    }

}
