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
    private Long productOptionId;
    private String optionName;
    private String optionValue;
    private int quantity;
    private int price;
    private String productImage;

    public CartGetDTO(Cart cart) {
        this.id = cart.getId();
        this.productId = cart.getProduct().getId();
        this.productName = cart.getProduct().getProductName();
        this.quantity = cart.getQuantity();
        if(!(cart.getProductOption() == null)) {
            this.productOptionId = cart.getProductOption().getId();
            this.optionName = cart.getProductOption().getOptionName();
            this.optionValue = cart.getProductOption().getOptionValue();
            this.price = cart.getProductOption().getPrice() * (100-cart.getProduct().getDiscountRate()/100);
        } else {
            this.price = cart.getProduct().getPrice() * (100-cart.getProduct().getDiscountRate()/100);
        }
        List<ProductImage> productImages = cart.getProduct().getProductImages();
        if (productImages != null && !productImages.isEmpty()) {
            this.productImage = productImages.get(0).getImageUrl();
        }
    }
}
