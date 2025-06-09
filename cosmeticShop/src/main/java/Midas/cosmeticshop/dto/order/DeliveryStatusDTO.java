package Midas.cosmeticshop.dto.order;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DeliveryStatusDTO {
    private String deliveryStatus; // 변경할 deliveryStatus

    DeliveryStatusDTO(String deliveryStatus) {
        this.deliveryStatus = deliveryStatus;
    }
}
