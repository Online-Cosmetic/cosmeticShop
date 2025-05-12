package Midas.cosmeticshop.dto;

import Midas.cosmeticshop.entity.OrderItem;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter @Setter
public class OrderDTO {
    private int totalPrice; // 할인 적용된 가격

    private String city;
    private String street;
    private String detail;

    private List<OrderItem> orderItems;

    public OrderDTO(int totalPrice, String city, String street, String detail, List<OrderItem> orderItems) {
        this.totalPrice = totalPrice;
        this.city = city;
        this.street = street;
        this.detail = detail;
        this.orderItems = orderItems;
    }
}
