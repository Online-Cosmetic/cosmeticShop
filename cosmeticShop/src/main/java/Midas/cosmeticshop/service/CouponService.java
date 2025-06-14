package Midas.cosmeticshop.service;

import Midas.cosmeticshop.repository.CouponRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * Service for managing coupons
 */
@Service
public class CouponService {

    private final CouponRepository couponRepository;

    @Autowired
    public CouponService(CouponRepository couponRepository) {
        this.couponRepository = couponRepository;
    }

    /**
     * Get the total number of coupons in the system
     * @return The total count of coupons
     */
    public long getTotalCouponsCount() {
        return couponRepository.count();
    }
}