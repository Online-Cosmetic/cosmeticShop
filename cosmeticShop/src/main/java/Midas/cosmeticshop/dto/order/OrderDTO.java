package Midas.cosmeticshop.dto.order;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Builder
@Getter @Setter
public class OrderDTO {
    private Long orderId; // 주문 ID 추가
    private int totalPrice; // 할인 적용된 가격

    private String city;
    private String street;
    private String detail;

    private LocalDateTime createdAt; // 주문 생성일 추가

    private List<OrderItemDTO> orderItems;
}
