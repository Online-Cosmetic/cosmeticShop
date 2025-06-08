package Midas.cosmeticshop.repository;

import Midas.cosmeticshop.entity.PaymentHistory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PaymentRepository extends JpaRepository<PaymentHistory, Long> {
    Optional<PaymentHistory> findByImpUid(String impUid);
}
