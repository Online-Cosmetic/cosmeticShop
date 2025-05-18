package Midas.cosmeticshop.repository;

import Midas.cosmeticshop.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<Order, Long> {
}
