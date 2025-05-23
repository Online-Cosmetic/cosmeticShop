package Midas.cosmeticshop.controller;

import Midas.cosmeticshop.dto.CouponMappingGetDTO;
import Midas.cosmeticshop.service.CouponMappingService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/coupons")
public class CouponMappingController {

    private final CouponMappingService couponMappingService;

    public CouponMappingController (CouponMappingService couponMappingService) {
        this.couponMappingService = couponMappingService;
    }

    @GetMapping("/mapping")
    public ResponseEntity<List<CouponMappingGetDTO>> getCouponMappings (Authentication authentication) {
        return ResponseEntity.ok().body(couponMappingService.GetCouponMapping(authentication.getName()));
    }

    @PostMapping("/mapping")
    public ResponseEntity<Void> postCouponMapping (@RequestParam Long couponId,
                                                   Authentication authentication) {
        couponMappingService.postCouponMapping(couponId, authentication.getName());
        return ResponseEntity.ok().build();
    }


}
