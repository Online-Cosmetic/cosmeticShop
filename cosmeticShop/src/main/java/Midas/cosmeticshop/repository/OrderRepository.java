package Midas.cosmeticshop.repository;

import Midas.cosmeticshop.dto.DailyOrderStatsBatchDTO;
import Midas.cosmeticshop.dto.HourlyProductOrderStatsBatchDTO;
import Midas.cosmeticshop.entity.Order;
import Midas.cosmeticshop.entity.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface OrderRepository extends JpaRepository<Order, Long> {
    @Query("""
        SELECT new Midas.cosmeticshop.dto.DailyOrderStatsBatchDTO(
            (SELECT SUM(o.totalPrice) FROM Order o WHERE o.createdAt BETWEEN :start AND :end),
            (SELECT COUNT(o) FROM Order o WHERE o.createdAt BETWEEN :start AND :end),
            (SELECT SUM(oi.quantity) FROM OrderItem oi WHERE oi.order.createdAt BETWEEN :start AND :end)
        )
    """)
    DailyOrderStatsBatchDTO findOrderStatsBetween(LocalDateTime start, LocalDateTime end);

    @Query("""
        SELECT new Midas.cosmeticshop.dto.ProductHourlyStatsBatchDTO(
            p,
            FUNCTION('DATE_FORMAT', o.createdAt, '%Y-%m-%d %H:00:00'),
            SUM(oi.quantity)
        )
        FROM OrderItem oi
        JOIN oi.order o
        JOIN oi.product p
        WHERE o.createdAt BETWEEN :start AND :end
        GROUP BY p, FUNCTION('DATE_FORMAT', o.createdAt, '%Y-%m-%d %H:00:00')
        ORDER BY FUNCTION('DATE_FORMAT', o.createdAt, '%Y-%m-%d %H:00:00'), p.id
        """)
    List<HourlyProductOrderStatsBatchDTO> findProductOrderStatsBetween(LocalDateTime start, LocalDateTime end);

    Optional<List<Order>> findAllByUser(User user);
}
