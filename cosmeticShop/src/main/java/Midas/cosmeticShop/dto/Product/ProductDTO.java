package Midas.cosmeticShop.dto.Product;

import Midas.cosmeticShop.entity.Product;
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


    public static ProductDTO from(Product product) {
        return new ProductDTO(
            product.getId(),
            product.getCategoryId(),
            product.getProductName(),
            product.getDescription(),
            product.getPrice(),
            product.getStock(),
            product.getCompany()
        );
    }

}
