package Midas.cosmeticshop.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class YearlyOrderStatsDTO {
    private int year;
    private Long totalSales;
    private Long orderCount;
    private Long totalQuantity;
}
