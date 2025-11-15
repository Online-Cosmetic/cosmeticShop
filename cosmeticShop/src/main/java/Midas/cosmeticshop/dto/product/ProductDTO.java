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
    private String thumbnailImageUrl;


    public static ProductDTO from(Product product) {
        String thumbnailImageUrl = null;
        if (product.getThumbnailImage() != null) {
            thumbnailImageUrl = product.getThumbnailImage().getImageUrl();
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
            thumbnailImageUrl
        );
    }

}
