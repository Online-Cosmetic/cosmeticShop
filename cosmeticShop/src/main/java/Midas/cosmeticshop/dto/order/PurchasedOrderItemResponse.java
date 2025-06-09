package Midas.cosmeticshop.dto.order;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;


@Getter
@Setter
@AllArgsConstructor
@Builder
public class PurchasedOrderItemResponse {
    OrderItemDTO orderItemDTO;
    Long orderId;

    // 추가된 필드들
    private String address;      // 배송 주소 (city + street + detail)
    private LocalDateTime orderDate;  // 주문 날짜
    private String buyerName;    // 구매자 이름
}
