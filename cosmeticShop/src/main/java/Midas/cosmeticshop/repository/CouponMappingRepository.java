package Midas.cosmeticshop.repository;

import Midas.cosmeticshop.entity.CouponMapping;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CouponMappingRepository extends JpaRepository<CouponMapping, Long> {
    List<CouponMapping> findByUserUserId(String userId);
}
