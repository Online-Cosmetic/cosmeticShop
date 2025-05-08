package Midas.cosmeticShop.dto;

import Midas.cosmeticShop.entity.Users.Company;
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
    private int stock;
    private Company company;
}
