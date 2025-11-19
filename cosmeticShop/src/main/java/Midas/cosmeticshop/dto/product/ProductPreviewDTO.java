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
    private String thumbImgUrl; //소문자로 수정
    private int liked; // 찜한 사람 수
    private String companyName;

    public static ProductPreviewDTO from(Product product) {
        String imageUrl = null;
        if (product.getThumbnailImage() != null) {
            imageUrl = product.getThumbnailImage().getImageUrl();
        }

        return new ProductPreviewDTO(
            product.getId(),
            product.getProductName(),
            product.getDescription(),
            product.getPrice(),
            product.getDiscountRate(), // 할인율 값 추가
            imageUrl,
            product.getLiked(), // 찜한 사람 수 추가
            product.getCompany().getCompanyName()
        );
    }
}
