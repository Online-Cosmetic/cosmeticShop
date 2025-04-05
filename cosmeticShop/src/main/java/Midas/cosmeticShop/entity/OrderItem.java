package Midas.cosmeticShop.entity;

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

    @Id @GeneratedValue
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    /* 수정 필요 ? */
//    @ManyToOne(fetch = FetchType.LAZY)
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_option_id")
    private ProductOption productOption;

    /* 주문 수량 */
    @Column(nullable = false)
    private int quantity;

    /* 주문 가격 */
    @Column(name = "price", nullable = false)
    private int orderPrice;

    /* 수정 필요 ? */
//    @Column(columnDefinition = "ENUM('배송준비중','배송중','배송완료') default '배송준비중'")
    @Enumerated(EnumType.STRING)
    private DeliveryStatus deliveryStatus;
}
