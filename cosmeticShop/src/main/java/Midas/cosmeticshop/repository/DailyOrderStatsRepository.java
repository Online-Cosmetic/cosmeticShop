package Midas.cosmeticshop.repository;

import Midas.cosmeticshop.dto.MonthlyOrderStatsDTO;
import Midas.cosmeticshop.dto.YearlyOrderStatsDTO;
import Midas.cosmeticshop.entity.DailyOrderStats;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.util.List;

public interface DailyOrderStatsRepository extends JpaRepository<DailyOrderStats, Long> {

    List<DailyOrderStats> findByDateBetween(LocalDate start, LocalDate end);

    @Query(value = """
            SELECT
                DATE_FORMAT(date, '%y-%m') AS month,
                SUM(total_sales) AS totalSales,
                SUM(order_count) AS orderCount,
                SUM(total_quantity) AS totalQuantity
            FROM daily_order_stats
            WHERE date BETWEEN :start AND :end
            GROUP BY month
            ORDER BY month
            """, nativeQuery = true)
    List<MonthlyOrderStatsDTO> findMonthlyOrderStats(LocalDate start, LocalDate end);

    @Query(value = """
            SELECT
                YEAR(date) AS year,
                SUM(total_sales) AS totalSales,
                SUM(order_count) AS orderCount,
                SUM(total_quantity) AS totalQuantity
            FROM daily_order_stats
            WHERE date BETWEEN :start AND :end
            GROUP BY year
            ORDER BY year
            """, nativeQuery = true)
    List<YearlyOrderStatsDTO> findYearlyOrderStats(LocalDate start, LocalDate end);
}
