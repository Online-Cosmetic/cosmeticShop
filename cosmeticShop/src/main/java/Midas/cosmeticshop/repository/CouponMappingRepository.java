package Midas.cosmeticshop.repository;

import Midas.cosmeticshop.entity.CouponMapping;
import Midas.cosmeticshop.entity.user.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CouponMappingRepository extends JpaRepository<CouponMapping, Long> {
    List<CouponMapping> findByUserUserId(String userId);
    List<CouponMapping> findByUser(User user);
}