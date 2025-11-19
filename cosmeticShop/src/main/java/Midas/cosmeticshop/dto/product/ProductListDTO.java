package Midas.cosmeticshop.dto.product;

import Midas.cosmeticshop.entity.product.Product;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductListDTO {
    private Long id;
    private String productName;
    private String description;
    private int categoryId;
    private int price;
    private int stock;
    private int discountRate;
    private String mainImageUrl;

    public static ProductListDTO from(Product product) {
        String imageUrl = null;
        if (product.getThumbnailImage() != null) {
            imageUrl = product.getThumbnailImage().getImageUrl();
        }

        return ProductListDTO.builder()
            .id(product.getId())
            .productName(product.getProductName())
            .description(product.getDescription())
            .categoryId(product.getCategoryId())
            .price(product.getPrice())
            .stock(product.getStock())
            .discountRate(product.getDiscountRate())
            .mainImageUrl(imageUrl)
            .build();
    }
}