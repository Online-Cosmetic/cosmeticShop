package Midas.cosmeticshop.dto.order;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Builder
@Getter @Setter
public class OrderDTO {
    private int totalPrice; // 할인 적용된 가격

    private String city;
    private String street;
    private String detail;

    private List<OrderItemDTO> orderItems;
}
