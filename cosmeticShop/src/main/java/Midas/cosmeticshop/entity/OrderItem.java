package Midas.cosmeticshop.entity;

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
}
