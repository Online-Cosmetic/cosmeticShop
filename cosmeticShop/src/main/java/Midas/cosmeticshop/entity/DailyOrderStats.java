package Midas.cosmeticshop.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "daily_order_stats")
@Getter
@Setter
public class DailyOrderStats {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "date", nullable = false)
    private LocalDate date;

    @Column(name = "total_sales", nullable = false)
    private Long totalSales;

    @Column(name = "order_count", nullable = false)
    private Long orderCount;

    @Column(name = "total_quantity", nullable = false)
    private Long totalQuantity;

}
