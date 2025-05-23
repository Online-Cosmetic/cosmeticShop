package Midas.cosmeticshop.entity;

import Midas.cosmeticshop.entity.user.Company;
import jakarta.persistence.*;
import lombok.*;

/* 기업에서 발행한 쿠폰 정보를 저장 */
@Entity
@Table(name = "coupons")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Coupon {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 쿠폰 이름
    @Column(name = "couponName", nullable = false)
    private String couponName;

    // 할인율 (정수 값)
    @Column(name = "discountRate", nullable = false)
    private int discountRate;

    // 쿠폰 유효 기간 (발급일 + duration = 만료일)
    @Column(name = "duration", nullable = false)
    private int duration;

    // 해당 쿠폰 사용이 가능한 기업을 참조
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;
}

