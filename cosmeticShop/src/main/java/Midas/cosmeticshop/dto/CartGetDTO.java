package Midas.cosmeticshop.dto;

import Midas.cosmeticshop.entity.Cart;
import Midas.cosmeticshop.entity.product.ProductImage;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CartGetDTO {
    private Long id;
    private Long productId;
    private String productName;
    private int quantity;
    private String companyName;
    private int price;
    private int discountRate; // 할인율 추가
    private String productImage;

    public CartGetDTO(Cart cart) {
        this.id = cart.getId();
        this.productId = cart.getProduct().getId();
        this.productName = cart.getProduct().getProductName();
        this.companyName = cart.getProduct().getCompany().getCompanyName();
        this.price = cart.getProduct().getPrice();
        this.discountRate = cart.getProduct().getDiscountRate(); // 상품 엔티티에서 할인율 가져오기
        if (cart.getProduct().getThumbnailImage() != null) {
            this.productImage = cart.getProduct().getThumbnailImage().getImageUrl();
        }
        else {
            List<ProductImage> productImages = cart.getProduct().getProductImages();
            if (productImages != null && !productImages.isEmpty()) {
                this.productImage = productImages.get(0).getImageUrl();
            }
        }
        this.quantity = cart.getQuantity();
    }
}
