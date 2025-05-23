package Midas.cosmeticshop.entity;

import Midas.cosmeticshop.dto.order.OrderDTO;
import Midas.cosmeticshop.dto.order.OrderItemDTO;
import Midas.cosmeticshop.entity.user.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Entity
@Table(name = "orders")
@AllArgsConstructor
@NoArgsConstructor
@Getter
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "total_price", nullable = false)
    private int totalPrice;

    /* 기존의 Address 연관관계를 제거하고, 주문 당시의 주소 정보를 스냅샷으로 저장
     * 객체 참조의 문제 시나리오 : 주문의 목적지 주소는 User 의 주소가 바뀌더라도 변하면 안됨.
     * 주문 시에 내장 값 타입을 불변하도록 복사하기 */
    @Embedded
    @AttributeOverrides({
        @AttributeOverride(name = "city", column = @Column(name = "address_city", nullable = false)),
        @AttributeOverride(name = "street", column = @Column(name = "address_street", nullable = false)),
        @AttributeOverride(name = "detail", column = @Column(name = "address_detail", nullable = false))
    })
    private OrderAddress orderAddress;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    /* 주문 상세와의 연관관계 */
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItem> orderItems = new ArrayList<>();;

    public Order makeOrder(User user, OrderDTO dto) {
        this.user = user;
        this.totalPrice = dto.getTotalPrice();
        this.orderAddress = new OrderAddress(dto.getCity(), dto.getStreet(), dto.getDetail());
        this.createdAt = LocalDateTime.now();
//        this.orderItems = new ArrayList<>();
        return this;
    }

    /* 엔티티 -> DTO 매핑 */
    public OrderDTO toDTO() {
        List<OrderItemDTO> orderItemDTOs = this.orderItems.stream()
            .map(OrderItem::toDTO)
            .collect(Collectors.toList());

        return OrderDTO.builder()
            .totalPrice(this.totalPrice)
            .city(this.orderAddress.getCity())
            .street(this.orderAddress.getStreet())
            .detail(this.orderAddress.getDetail())
            .orderItems(orderItemDTOs)
            .build();
    }

}
