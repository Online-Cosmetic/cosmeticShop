package Midas.cosmeticshop.dto;

import Midas.cosmeticshop.entity.Coupon;
import Midas.cosmeticshop.entity.CouponMapping;

import java.time.LocalDateTime;

public class CouponMappingGetDTO {

    private Long couponId;
    private String couponName;
    private String companyName;
    private int discountRate;
    private LocalDateTime issuedDate;
    private LocalDateTime expirationDate;
    private Boolean isUsed;

    public CouponMappingGetDTO(CouponMapping couponMapping) {
        Coupon coupon = couponMapping.getCoupon();
        this.couponId = coupon.getId();
        this.couponName = coupon.getCouponName();
        this.companyName = coupon.getCompany().getCompanyName();
        this.discountRate = coupon.getDiscountRate();
        this.issuedDate = couponMapping.getIssuedDate();
        this.expirationDate = couponMapping.getExpirationDate();
        this.isUsed = couponMapping.getIsUsed();
    }
}
