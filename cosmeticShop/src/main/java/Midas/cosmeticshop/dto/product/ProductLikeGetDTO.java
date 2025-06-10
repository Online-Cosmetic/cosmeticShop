package Midas.cosmeticshop.dto.product;

import Midas.cosmeticshop.entity.product.Product;
import Midas.cosmeticshop.entity.product.ProductImage;
import Midas.cosmeticshop.entity.product.ProductLike;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ProductLikeGetDTO {

    private Long productId;
    private String productName;
    private String companyName;
    private int price;
    private int discountRate;
    private String imageUrl;  // 통일된 이미지 URL 필드

    public ProductLikeGetDTO(ProductLike productLike) {
        Product product = productLike.getProduct();
        this.productId = product.getId();
        this.productName = product.getProductName();
        this.companyName = product.getCompany().getCompanyName();
        this.price = product.getPrice();
        this.discountRate = product.getDiscountRate();
        
        // 이미지 URL 설정 로직 - 우선순위에 따라 하나의 필드만 사용
        if (product.getThumbnailImage() != null) {
            this.imageUrl = product.getThumbnailImage().getImageUrl();
        } else {
            List<ProductImage> productImages = product.getProductImages();
            if (productImages != null && !productImages.isEmpty()) {
                this.imageUrl = productImages.get(0).getImageUrl();
            }
        }
    }
}