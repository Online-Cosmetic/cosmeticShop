package Midas.cosmeticshop.dto.payment;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class TopProductDTO {
    private Long productId;
    private String productName;
    private Integer price;
    private Integer totalQuantity;
    private Long totalSales;
}