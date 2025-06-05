package Midas.cosmeticshop.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

/* Iamport API 를 활용한 결제를 위한 엔티티 */
@Entity
@Table(name = "payment_history")
@Getter
@Setter
public class PaymentHistory {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String impUid;

    @Column
    private String merchantUid;

    @Column
    private Long orderId;

    @Column
    private Integer amount;

    @Column
    private String paymentMethod;

    @Column
    private String status;

    @Column
    private String buyerName;

    @Column
    private String buyerEmail;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
}
