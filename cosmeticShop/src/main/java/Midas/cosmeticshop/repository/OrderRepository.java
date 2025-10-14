package Midas.cosmeticshop.repository;

import Midas.cosmeticshop.dto.DailyOrderStatsBatchDTO;
import Midas.cosmeticshop.dto.HourlyProductOrderStatsBatchDTO;
import Midas.cosmeticshop.entity.Order;
import Midas.cosmeticshop.entity.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface OrderRepository extends JpaRepository<Order, Long> {
    @Query("""
        SELECT new Midas.cosmeticshop.dto.DailyOrderStatsBatchDTO(
            (SELECT CAST(SUM(ph.amount) AS Long) FROM PaymentHistory ph JOIN Order o ON ph.orderId = o.id WHERE o.createdAt BETWEEN :start AND :end AND ph.status = 'COMPLETED'),
            (SELECT COUNT(o) FROM Order o WHERE o.createdAt BETWEEN :start AND :end),
            (SELECT SUM(oi.quantity) FROM OrderItem oi WHERE oi.order.createdAt BETWEEN :start AND :end)
        )
    """)
    DailyOrderStatsBatchDTO findOrderStatsBetween(LocalDateTime start, LocalDateTime end);

    @Query("""
        SELECT new Midas.cosmeticshop.dto.HourlyProductOrderStatsBatchDTO(
          p,
          cast(function('to_char', function('date_trunc','hour', o.createdAt), 'YYYY-MM-DD HH24:00:00') as string),
          SUM(oi.quantity)
        )
        FROM OrderItem oi
        JOIN oi.order o
        JOIN oi.product p
        WHERE o.createdAt BETWEEN :start AND :end
        GROUP BY
          p,
          cast(function('to_char', function('date_trunc','hour', o.createdAt), 'YYYY-MM-DD HH24:00:00') as string)
        ORDER BY
          cast(function('to_char', function('date_trunc','hour', o.createdAt), 'YYYY-MM-DD HH24:00:00') as string),
          p.id
        """)
List<HourlyProductOrderStatsBatchDTO> findProductOrderStatsBetween(
    @Param("start") LocalDateTime start, 
    @Param("end") LocalDateTime end);

    Optional<List<Order>> findAllByUser(User user);
}
