package Midas.cosmeticshop.dto;

import Midas.cosmeticshop.entity.CouponMapping;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CouponMappingGetDTO {
    private Long id;            // CouponMapping의 id
    private Long couponId;      // 쿠폰 ID
    private String couponName;  // 쿠폰 이름
    private String companyName; // 회사 이름
    private Long companyId;     // 회사 ID 추가
    private int discountRate;   // 할인율
    private LocalDateTime issuedDate;     // 발급 일자
    private LocalDateTime expirationDate; // 만료 일자
    private Boolean isUsed;     // 사용 여부
    
    // 엔티티를 DTO로 변환하는 생성자
    public CouponMappingGetDTO(CouponMapping couponMapping) {
        this.id = couponMapping.getId();
        this.couponId = couponMapping.getCoupon().getId();
        this.couponName = couponMapping.getCoupon().getCouponName();
        this.companyName = couponMapping.getCoupon().getCompany().getCompanyName();
        this.companyId = couponMapping.getCoupon().getCompany().getId();
        this.discountRate = couponMapping.getCoupon().getDiscountRate();
        this.issuedDate = couponMapping.getIssuedDate();
        this.expirationDate = couponMapping.getExpirationDate();
        this.isUsed = couponMapping.getIsUsed();
    }
}