package Midas.cosmeticshop.repository;

import Midas.cosmeticshop.entity.PaymentHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface PaymentHistoryRepository extends JpaRepository<PaymentHistory, Long> {
    Optional<PaymentHistory> findByOrderId(Long orderId);
    Optional<PaymentHistory> findByImpUid(String impUid);

    @Query(value = """
        SELECT DATE(p.created_at) as date, 
               SUM(p.amount) as total
        FROM payment_history p
        INNER JOIN orders o ON p.order_id = o.id
        INNER JOIN order_items oi ON o.id = oi.order_id
        INNER JOIN products prod ON oi.product_id = prod.id
        INNER JOIN companies c ON prod.company_id = c.id
        WHERE c.company_name = :companyName
        AND p.created_at >= :startDate
        AND p.status = 'COMPLETED'
        AND prod.active = true
        GROUP BY DATE(p.created_at)
        ORDER BY date DESC
    """, nativeQuery = true)
    List<Object[]> findWeeklySalesByCompany(
        @Param("companyName") String companyName,
        @Param("startDate") LocalDateTime startDate
    );

    @Query(value = """
    SELECT prod.id, prod.name, prod.price, 
       SUM(oi.quantity) as total_quantity,
       SUM(p.amount) as total_sales
    FROM payment_history p
    INNER JOIN orders o ON p.order_id = o.id
    INNER JOIN order_items oi ON o.id = oi.order_id
    INNER JOIN products prod ON oi.product_id = prod.id
    INNER JOIN companies c ON prod.company_id = c.id
    WHERE c.company_name = :companyName
    AND p.status = 'COMPLETED'
    AND prod.active = true
    GROUP BY prod.id, prod.name, prod.price
    ORDER BY total_quantity DESC
    LIMIT 5
    """, nativeQuery = true)
    List<Object[]> findTop5ProductsByCompany(@Param("companyName") String companyName);

    @Query(value = """
    SELECT DISTINCT p.id, p.imp_uid, p.merchant_uid, p.amount, 
           p.payment_method, p.status, p.buyer_name, 
           p.buyer_email, p.created_at, o.id as order_id
    FROM payment_history p
    INNER JOIN orders o ON p.order_id = o.id
    INNER JOIN order_items oi ON o.id = oi.order_id
    INNER JOIN products prod ON oi.product_id = prod.id
    INNER JOIN companies c ON prod.company_id = c.id
    WHERE c.company_name = :companyName   
    AND p.status = 'COMPLETED'
    AND prod.active = true
    ORDER BY p.created_at DESC
    LIMIT :limit OFFSET :offset
    """, nativeQuery = true)
    List<Object[]> findLatestTransactionsByCompany(
        @Param("companyName") String companyName,
        @Param("limit") int limit,
        @Param("offset") int offset
    );

    @Query(value = """
    SELECT SUM(oi.quantity) as total_quantity
    FROM payment_history p
    INNER JOIN orders o ON p.order_id = o.id
    INNER JOIN order_items oi ON o.id = oi.order_id
    INNER JOIN products prod ON oi.product_id = prod.id
    INNER JOIN companies c ON prod.company_id = c.id
    WHERE c.company_name = :companyName
    AND p.created_at >= :startDate
    AND p.status = 'COMPLETED'
    AND prod.active = true
    """, nativeQuery = true)
Long findTotalQuantityByCompany(
    @Param("companyName") String companyName,
    @Param("startDate") LocalDateTime startDate
);

    /* 일별 판매액 통계 - 특정 날짜 */
    @Query(value = """
        SELECT CAST(p.created_at AS DATE) as date, 
               SUM(p.amount) as total
        FROM payment_history p
        INNER JOIN orders o ON p.order_id = o.id
        INNER JOIN order_items oi ON o.id = oi.order_id
        INNER JOIN products prod ON oi.product_id = prod.id
        INNER JOIN companies c ON prod.company_id = c.id
        WHERE c.company_name = :companyName
        AND CAST(p.created_at AS DATE) = CAST(:selectedDate AS DATE)
        AND p.status = 'COMPLETED'
        AND prod.active = true
        GROUP BY CAST(p.created_at AS DATE)
        ORDER BY date DESC
    """, nativeQuery = true)
    List<Object[]> findDailySalesByCompany(
        @Param("companyName") String companyName,
        @Param("selectedDate") java.time.LocalDate selectedDate
    );

    /* 일별 판매수량 통계 - 특정 날짜 */
    @Query(value = """
        SELECT CAST(p.created_at AS DATE) as date, 
               SUM(oi.quantity) as total_quantity
        FROM payment_history p
        INNER JOIN orders o ON p.order_id = o.id
        INNER JOIN order_items oi ON o.id = oi.order_id
        INNER JOIN products prod ON oi.product_id = prod.id
        INNER JOIN companies c ON prod.company_id = c.id
        WHERE c.company_name = :companyName
        AND CAST(p.created_at AS DATE) = CAST(:selectedDate AS DATE)
        AND p.status = 'COMPLETED'
        AND prod.active = true
        GROUP BY CAST(p.created_at AS DATE)
        ORDER BY date DESC
    """, nativeQuery = true)
    List<Object[]> findDailyQuantityByCompany(
        @Param("companyName") String companyName,
        @Param("selectedDate") java.time.LocalDate selectedDate
    );

    /* 월별 판매액 통계 - 특정 년도/월 */
    @Query(value = """
        SELECT TO_CHAR(p.created_at, 'YYYY-MM') as month, 
               SUM(p.amount) as total
        FROM payment_history p
        INNER JOIN orders o ON p.order_id = o.id
        INNER JOIN order_items oi ON o.id = oi.order_id
        INNER JOIN products prod ON oi.product_id = prod.id
        INNER JOIN companies c ON prod.company_id = c.id
        WHERE c.company_name = :companyName
        AND EXTRACT(YEAR FROM p.created_at) = :year
        AND EXTRACT(MONTH FROM p.created_at) = :month
        AND p.status = 'COMPLETED'
        AND prod.active = true
        GROUP BY TO_CHAR(p.created_at, 'YYYY-MM')
        ORDER BY month DESC
    """, nativeQuery = true)
    List<Object[]> findMonthlySalesByCompany(
        @Param("companyName") String companyName,
        @Param("year") int year,
        @Param("month") int month
    );

    /* 월별 판매수량 통계 - 특정 년도/월 */
    @Query(value = """
        SELECT TO_CHAR(p.created_at, 'YYYY-MM') as month, 
               SUM(oi.quantity) as total_quantity
        FROM payment_history p
        INNER JOIN orders o ON p.order_id = o.id
        INNER JOIN order_items oi ON o.id = oi.order_id
        INNER JOIN products prod ON oi.product_id = prod.id
        INNER JOIN companies c ON prod.company_id = c.id
        WHERE c.company_name = :companyName
        AND EXTRACT(YEAR FROM p.created_at) = :year
        AND EXTRACT(MONTH FROM p.created_at) = :month
        AND p.status = 'COMPLETED'
        AND prod.active = true
        GROUP BY TO_CHAR(p.created_at, 'YYYY-MM')
        ORDER BY month DESC
    """, nativeQuery = true)
    List<Object[]> findMonthlyQuantityByCompany(
        @Param("companyName") String companyName,
        @Param("year") int year,
        @Param("month") int month
    );

    /* 연도별 판매액 통계 - 특정 년도 */
    @Query(value = """
        SELECT EXTRACT(YEAR FROM p.created_at) as year, 
               SUM(p.amount) as total
        FROM payment_history p
        INNER JOIN orders o ON p.order_id = o.id
        INNER JOIN order_items oi ON o.id = oi.order_id
        INNER JOIN products prod ON oi.product_id = prod.id
        INNER JOIN companies c ON prod.company_id = c.id
        WHERE c.company_name = :companyName
        AND EXTRACT(YEAR FROM p.created_at) = :year
        AND p.status = 'COMPLETED'
        AND prod.active = true
        GROUP BY EXTRACT(YEAR FROM p.created_at)
        ORDER BY year DESC
    """, nativeQuery = true)
    List<Object[]> findYearlySalesByCompany(
        @Param("companyName") String companyName,
        @Param("year") int year
    );

    /* 연도별 판매수량 통계 - 특정 년도 */
    @Query(value = """
        SELECT EXTRACT(YEAR FROM p.created_at) as year, 
               SUM(oi.quantity) as total_quantity
        FROM payment_history p
        INNER JOIN orders o ON p.order_id = o.id
        INNER JOIN order_items oi ON o.id = oi.order_id
        INNER JOIN products prod ON oi.product_id = prod.id
        INNER JOIN companies c ON prod.company_id = c.id
        WHERE c.company_name = :companyName
        AND EXTRACT(YEAR FROM p.created_at) = :year
        AND p.status = 'COMPLETED'
        AND prod.active = true
        GROUP BY EXTRACT(YEAR FROM p.created_at)
        ORDER BY year DESC
    """, nativeQuery = true)
    List<Object[]> findYearlyQuantityByCompany(
        @Param("companyName") String companyName,
        @Param("year") int year
    );
}
