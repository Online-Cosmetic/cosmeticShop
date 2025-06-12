package Midas.cosmeticshop.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CouponDTO {
    private Long id;
    private String couponName;
    private int discountRate;
    private int duration;
    private Long companyId;
    private String companyName;
}