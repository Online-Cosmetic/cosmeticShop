package Midas.cosmeticshop.dto;

import Midas.cosmeticshop.entity.DailyOrderStats;
import lombok.Getter;

import java.time.LocalDate;

@Getter
public class DailyOrderStatsDTO {
    private LocalDate date;
    private Long totalSales;
    private Long orderCount;
    private Long totalQuantity;

    public DailyOrderStatsDTO(DailyOrderStats stats) {
        this.date = stats.getDate();
        this.totalSales = stats.getTotalSales();
        this.orderCount = stats.getOrderCount();
        this.totalQuantity = stats.getTotalQuantity();
    }
}
