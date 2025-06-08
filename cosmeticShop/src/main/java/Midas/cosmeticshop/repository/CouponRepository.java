package Midas.cosmeticshop.repository;

import Midas.cosmeticshop.entity.Coupon;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CouponRepository extends JpaRepository<Coupon, Long> {
}
