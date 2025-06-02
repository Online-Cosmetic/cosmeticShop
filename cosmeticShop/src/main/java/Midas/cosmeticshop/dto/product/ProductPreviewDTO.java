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
    private String ThumbImgUrl;

    public static ProductPreviewDTO from(Product product) {
        return new ProductPreviewDTO(
            product.getId(),
            product.getProductName(),
            product.getDescription(),
            product.getPrice(),
            product.getThumbnailImage().getImageUrl()
        );
    }
}
