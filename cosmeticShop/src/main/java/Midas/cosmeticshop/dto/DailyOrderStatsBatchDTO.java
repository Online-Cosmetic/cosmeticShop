package Midas.cosmeticshop.dto;

import lombok.Getter;

@Getter
public class DailyOrderStatsBatchDTO {
    private Long totalSales;
    private Long orderCount;
    private Long totalQuantity;
    public DailyOrderStatsBatchDTO (Long totalSales, Long orderCount, Long totalQuantity) {
        this.totalSales = totalSales != null ? totalSales : 0L;
        this.orderCount = orderCount != null ? orderCount : 0L;
        this.totalQuantity = totalQuantity != null ? totalQuantity : 0L;
    }
}
