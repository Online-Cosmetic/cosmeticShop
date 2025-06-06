package Midas.cosmeticshop.dto.order;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
@AllArgsConstructor
public class PurchasedOrderItemResponse {
    OrderItemDTO orderItemDTO;
    Long orderId;
}
