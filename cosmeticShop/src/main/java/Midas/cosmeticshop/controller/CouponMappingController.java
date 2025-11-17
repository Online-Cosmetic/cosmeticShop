package Midas.cosmeticshop.controller;

import Midas.cosmeticshop.dto.CouponDTO;
import Midas.cosmeticshop.dto.CouponMappingDto;
import Midas.cosmeticshop.dto.CouponMappingGetDTO;
import Midas.cosmeticshop.service.CouponMappingService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/coupons")
public class CouponMappingController {

    private final CouponMappingService couponMappingService;

    public CouponMappingController(CouponMappingService couponMappingService) {
        this.couponMappingService = couponMappingService;
    }

    @GetMapping("/mapping")
    public ResponseEntity<List<CouponMappingGetDTO>> getCouponMappings(Authentication authentication) {
        // 1) 未登录 或 匿名访问时，直接返回 401，不要进 service
        if (authentication == null || !authentication.isAuthenticated()
                || "anonymousUser".equals(authentication.getName())) {
            return ResponseEntity.status(401).build();
        }

        String userId = authentication.getName(); // 这里的 userId 必须能在 UserRepo.findByUserId(...) 中找到

        try {
            List<CouponMappingGetDTO> list = couponMappingService.GetCouponMapping(userId);
            return ResponseEntity.ok(list);
        } catch (Exception e) {
            // 这里打印一下具体异常，方便你在控制台看到真实原因
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }

    @PostMapping("/mapping")
    public ResponseEntity<Void> postCouponMapping(@RequestParam Long couponId,
            Authentication authentication) {
        couponMappingService.postCouponMapping(couponId, authentication.getName());
        return ResponseEntity.ok().build();
    }

    /**
     * 특정 회사에서 발행한 사용 가능한 쿠폰 목록을 조회합니다.
     * 로그인한 사용자가 아직 받지 않은 쿠폰만 반환됩니다.
     *
     * @param companyId      쿠폰을 발행한 회사의 ID
     * @param authentication 현재 인증된 사용자 정보
     * @return 사용 가능한 쿠폰 목록
     */
    @GetMapping("/available/company/{companyId}")
    public ResponseEntity<List<CouponDTO>> getAvailableCouponsByCompany(
            @PathVariable Long companyId,
            Authentication authentication) {
        // 인증된 사용자가 있는 경우 사용자 ID를 전달, 없으면 null 전달
        String userId = authentication != null ? authentication.getName() : null;
        List<CouponDTO> availableCoupons = couponMappingService.getAvailableCouponsByCompany(companyId, userId);
        return ResponseEntity.ok().body(availableCoupons);
    }

    /**
     * 주문 페이지에서 사용자별·회사별 사용 가능한 쿠폰 조회
     */
    @GetMapping("/available/order/{companyId}")
    public ResponseEntity<List<CouponMappingDto>> getAvailableForOrder(
            @PathVariable Long companyId,
            @AuthenticationPrincipal UserDetails user) {
        String userId = user.getUsername();
        List<CouponMappingDto> dtos = couponMappingService.getAvailableCoupons(userId, companyId);
        return ResponseEntity.ok(dtos);
    }
}
