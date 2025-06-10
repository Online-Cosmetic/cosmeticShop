package Midas.cosmeticshop.repository;

import Midas.cosmeticshop.entity.product.HourlyProductOrderStats;
import Midas.cosmeticshop.entity.product.Product;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;
import java.util.List;

public interface HourlyProductOrderStatsRepository extends JpaRepository<HourlyProductOrderStats, Long> {
    @Query("""
        SELECT s.product
        FROM HourlyProductOrderStats s
        WHERE s.hour BETWEEN :start AND :end
        GROUP BY s.product
        ORDER BY SUM(s.quantity) DESC
        """)
    List<Product> findByHourBetweenOrderByQuantityDesc(LocalDateTime start, LocalDateTime end, Pageable pageable);

    @Query("""
        SELECT s.product
        FROM HourlyProductOrderStats s
        WHERE s.hour BETWEEN :start AND :end
            AND s.product.company.id = :companyId
        GROUP BY s.product
        ORDER BY SUM(s.quantity) DESC
        """)
    List<Product> findByCompanyAndHourBetweenOrderByQuantityDesc(Long companyId, LocalDateTime start, LocalDateTime end, Pageable pageable);

    @Query("""
        SELECT s.product
        FROM HourlyProductOrderStats s
        WHERE s.hour BETWEEN :start AND :end
            AND s.product.categoryId = :categoryId
        GROUP BY s.product
        ORDER BY SUM(s.quantity) DESC
        """)
    List<Product> findByCategoryAndHourBetweenOrderByQuantityDesc(Long categoryId, LocalDateTime start, LocalDateTime end, Pageable pageable);
}
