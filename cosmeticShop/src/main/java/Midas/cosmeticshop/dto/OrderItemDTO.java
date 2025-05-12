package Midas.cosmeticshop.dto;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class OrderItemDTO {
    private String city; // 도시
    private String street; // 길
    private String detail; // 세부주소

    private Long productId; // 프론트엔드가 url 에서 찾을 수 있다
    private Integer quantity;
    private Integer price; // 단일 상품의 원래 가격

    OrderItemDTO(Long productId, Integer quantity, Integer price) {
        this.productId = productId;
        this.quantity = quantity;
        this.price = price;
    }
}
