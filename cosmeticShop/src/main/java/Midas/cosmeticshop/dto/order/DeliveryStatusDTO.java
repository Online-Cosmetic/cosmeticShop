package Midas.cosmeticshop.dto.order;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DeliveryStatusDTO {
    Long orderItemId;
    String deliveryStatus; // 변경할 deliveryStatus

    DeliveryStatusDTO(Long orderItemId, String deliveryStatus) {
        this.orderItemId = orderItemId;
        this.deliveryStatus = deliveryStatus;
    }
}
