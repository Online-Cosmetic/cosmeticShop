package Midas.cosmeticshop.dto;

import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class CouponMappingDto {
    private Long mappingId;
    private Long couponId;
    private String couponName;
    private int discountAmount; // 또는 percent 등
    private LocalDateTime expirationDate;
}