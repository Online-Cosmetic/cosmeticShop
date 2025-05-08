package Midas.cosmeticShop.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CartPostDTO {

    private Long productId;
    private Long productOptionId;
    private int quantity;

}
