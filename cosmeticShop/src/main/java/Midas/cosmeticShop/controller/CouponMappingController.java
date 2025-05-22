package Midas.cosmeticshop.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/coupons")
public class CouponMappingController {

    @GetMapping("/Mapping")
    public ResponseEntity<List<CouponMappingGetDTO>> getCouponMappings (Authentication authentication) {


    }

    @PostMapping("/Mapping")
    public ResponseEntity<Void> postCouponMapping (@RequestParam Long couponId,
                                                   Authentication authentication) {


    }


}
