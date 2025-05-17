package Midas.cosmeticshop.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

/* Iamport API 를 활용한 결제를 위한 엔티티 */
@Entity
@Table(name = "payments")
@Getter
@Setter
public class PaymentHistory {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String impUid;

    @Column(nullable = false)
    private Long orderId;

    @Column(nullable = false)
    private Integer amount;

    @Column(nullable = false)
    private String paymentMethod;

    @Column(nullable = false)
    private String paymentStatus;

    @Column(nullable = false)
    private LocalDateTime paidAt;
}
