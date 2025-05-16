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
    private int discountedPrice;
    private String productImage;

    public ProductLikeGetDTO(ProductLike productLike) {
        Product product = productLike.getProduct();
        this.productId = product.getId();
        this.productName = product.getProductName();
        this.companyName = product.getCompany().getCompanyName();
        this.price = product.getPrice();
        this.discountedPrice = product.getPrice() * (100-product.getDiscountRate()/100);
        List<ProductImage> productImages = product.getProductImages();
        if (productImages != null && !productImages.isEmpty()) {
            this.productImage = productImages.get(0).getImageUrl();
        }
    }
}
