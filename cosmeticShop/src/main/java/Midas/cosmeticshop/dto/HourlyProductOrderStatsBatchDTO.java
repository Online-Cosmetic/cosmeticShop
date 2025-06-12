package Midas.cosmeticshop.dto;

import Midas.cosmeticshop.entity.product.Product;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class HourlyProductOrderStatsBatchDTO {
    private Product product;
    private String hour;
    private Long quantity;
    public HourlyProductOrderStatsBatchDTO(Product product, String hour, Long quantity) {
        this.product = product;
        this.hour = hour;
        this.quantity = quantity;
    }
}
