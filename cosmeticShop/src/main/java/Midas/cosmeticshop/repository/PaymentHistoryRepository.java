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
           SUM(p.amount * oi.quantity) as total
    FROM payment_history p
    INNER JOIN orders o ON p.order_id = o.id
    INNER JOIN order_items oi ON o.id = oi.order_id
    INNER JOIN products prod ON oi.product_id = prod.id
    INNER JOIN companies c ON prod.company_id = c.id
    WHERE c.company_name = :companyName
    AND p.created_at >= :startDate
    AND p.status = 'paid'
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
           SUM(p.amount * oi.quantity) as total_sales
    FROM payment_history p
    INNER JOIN orders o ON p.order_id = o.id
    INNER JOIN order_items oi ON o.id = oi.order_id
    INNER JOIN products prod ON oi.product_id = prod.id
    INNER JOIN companies c ON prod.company_id = c.id
    WHERE c.company_name = :companyName
    AND p.status = 'paid'
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
    ORDER BY p.created_at DESC
    LIMIT :limit OFFSET :offset
    """, nativeQuery = true)
    List<Object[]> findLatestTransactionsByCompany(
        @Param("companyName") String companyName,
        @Param("limit") int limit,
        @Param("offset") int offset
    );
}