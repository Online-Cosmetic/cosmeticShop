package Midas.cosmeticshop.entity;

import Midas.cosmeticshop.entity.user.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "coupon_mappings")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CouponMapping {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 쿠폰을 발급받은 회원 참조
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // 발급받은 쿠폰 참조 : 쿠폰의 종류를 의미
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "coupon_id", nullable = false)
    private Coupon coupon;

    // 쿠폰 발급 일시
    @Column(name = "issued_date", nullable = false)
    private LocalDateTime issuedDate;

    // 쿠폰 만료 일시
    @Column(name = "expiration_date", nullable = false)
    private LocalDateTime expirationDate;

    // 쿠폰 사용 여부 (기본값 false)
    @Column(name = "is_used", nullable = false)
    private Boolean isUsed = false;
}
