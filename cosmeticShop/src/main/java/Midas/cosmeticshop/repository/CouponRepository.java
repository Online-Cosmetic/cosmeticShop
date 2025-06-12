package Midas.cosmeticshop.repository;

import Midas.cosmeticshop.entity.Coupon;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CouponRepository extends JpaRepository<Coupon, Long> {
    List<Coupon> findByCompanyId(Long companyId);
}