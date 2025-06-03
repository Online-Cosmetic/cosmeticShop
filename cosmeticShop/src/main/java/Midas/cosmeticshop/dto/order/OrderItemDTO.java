package Midas.cosmeticshop.dto.order;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Builder
@Getter @Setter
public class OrderItemDTO {
    private Long productId; // 프론트엔드가 url 에서 찾을 수 있다
    private Integer quantity;
    private Integer price; // 단일 상품의 원래 가격
    private String productName; // 상품명
    private String deliveryStatus; // 배송상태
    private String mainImageUrl; // 썸네일 url

    public OrderItemDTO(Long productId, Integer quantity, Integer price, String productName, String deliveryStatus, String mainImageUrl) {
        this.productId = productId;
        this.quantity = quantity;
        this.price = price;
        this.productName = productName;
        this.deliveryStatus = deliveryStatus;
        this.mainImageUrl = mainImageUrl;
    }
}
