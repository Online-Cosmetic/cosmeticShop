package Midas.cosmeticshop.repository;

import Midas.cosmeticshop.dto.DailyOrderStatsBatchDTO;
import Midas.cosmeticshop.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.time.LocalDateTime;

public interface OrderRepository extends JpaRepository<Order, Long> {
    @Query("""
        SELECT new com.example.dto.TodayOrderStatsDTO(
            (SELECT SUM(o.totalPrice) FROM Order o WHERE o.createdAt BETWEEN :start AND :end),
            (SELECT COUNT(o) FROM Order o WHERE o.createdAt BETWEEN :start AND :end),
            (SELECT SUM(oi.quantity) FROM OrderItem oi WHERE oi.order.createdAt BETWEEN :start AND :end)
        )
    """)
    DailyOrderStatsBatchDTO findOrderStatsBetween(LocalDateTime start, LocalDateTime end);
}
