package Midas.cosmeticshop.repository;

import Midas.cosmeticshop.entity.DeliveryStatus;
import Midas.cosmeticshop.entity.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {

    List<OrderItem> findAllByOrderId(Long orderId);

    @Modifying
    @Query("UPDATE OrderItem oi SET oi.deliveryStatus = :deliveryStatus " +
        "WHERE oi.id = :orderItemId")
    ResponseEntity<Void> updateDeliveryStatus(@Param("orderItemId") Long orderItemId, @Param("deliveryStatus") DeliveryStatus deliveryStatus);

    @Query("SELECT oi FROM OrderItem oi JOIN FETCH oi.product p " +
        "WHERE p.company.companyName = :companyName")
    List<OrderItem> findAllByCompanyName(@Param("companyName") String companyName);

}
