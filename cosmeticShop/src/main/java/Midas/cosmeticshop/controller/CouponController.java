package Midas.cosmeticshop.controller;

import Midas.cosmeticshop.service.CouponService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/coupons")
public class CouponController {

    private final CouponService couponService;

    @Autowired
    public CouponController(CouponService couponService) {
        this.couponService = couponService;
    }

    /**
     * Get the total number of coupons in the system
     * 
     * @return The total count of coupons
     */
    @GetMapping("/count")
    public ResponseEntity<Long> getTotalCouponsCount() {
        return ResponseEntity.ok(couponService.getTotalCouponsCount());
    }
}