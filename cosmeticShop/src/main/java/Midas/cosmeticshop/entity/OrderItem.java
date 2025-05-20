package Midas.cosmeticshop.entity;

import Midas.cosmeticshop.dto.order.OrderItemDTO;
import Midas.cosmeticshop.entity.product.Product;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "order_items")
@AllArgsConstructor
@NoArgsConstructor
@Getter
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    /* 주문 수량 */
    @Column(nullable = false)
    private int quantity;

    /* 주문 가격 */
    @Column(name = "price", nullable = false)
    private int orderPrice;

    /* 배송 상태 : READY, PROG, COMP*/
    @Enumerated(EnumType.STRING)
    private DeliveryStatus deliveryStatus;

    public OrderItem(Order order, Product product, int quantity, int orderPrice, DeliveryStatus deliveryStatus) {
        this.order = order;
        this.product = product;
        this.quantity = quantity;
        this.orderPrice = orderPrice;
        this.deliveryStatus = deliveryStatus;
    }

    /* DTO -> 엔티티 매핑 */
    public static OrderItem fromDTO(OrderItemDTO dto, Order order, Product product) {
        return new OrderItem(
            order,
            product,
            dto.getQuantity(),
            dto.getPrice(), // 할인 적용 전 가격이면, 서비스에서 할인 계산 후 주입
            DeliveryStatus.READY // 기본값
        );
    }

    /* 엔티티 -> DTO 매핑 */
    public OrderItemDTO toDTO() {
        return new OrderItemDTO(
            this.product.getId(),
            this.quantity,
            this.orderPrice,
            this.product.getProductName(),
            this.deliveryStatus != null ? this.deliveryStatus.name() : "READY"
        );
    }
}
