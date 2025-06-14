package Midas.cosmeticshop.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CouponPostDTO {
    private String couponName;
    private int discountRate;
    private int duration;
    private String companyName;

    @Override
    public String toString() {
        return "CouponPostDTO{" +
                "couponName='" + couponName + '\'' +
                ", discountRate=" + discountRate +
                ", duration=" + duration +
                ", companyName='" + companyName + '\'' +
                '}';
    }
}
