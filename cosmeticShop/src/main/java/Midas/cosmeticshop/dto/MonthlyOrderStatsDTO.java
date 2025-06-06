package Midas.cosmeticshop.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MonthlyOrderStatsDTO {
    private String yearMonth;
    private Long totalSales;
    private Long orderCount;
    private Long totalQuantity;
}
