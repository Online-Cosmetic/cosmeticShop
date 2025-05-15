package Midas.cosmeticShop.dto;

import Midas.cosmeticShop.entity.Cart;
import Midas.cosmeticShop.entity.ProductImage;
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
    private String companyName;
    private int price;
    private String productImage;
    private int quantity;

    public CartGetDTO(Cart cart) {
        this.id = cart.getId();
        this.productId = cart.getProduct().getId();
        this.productName = cart.getProduct().getProductName();
        this.companyName = cart.getProduct().getCompany().getCompanyName();
        this.price = cart.getProduct().getPrice() * (100-cart.getProduct().getDiscountRate()/100);
        List<ProductImage> productImages = cart.getProduct().getProductImages();
        if (productImages != null && !productImages.isEmpty()) {
            this.productImage = productImages.get(0).getImageUrl();
        }
        this.quantity = cart.getQuantity();
    }
}
