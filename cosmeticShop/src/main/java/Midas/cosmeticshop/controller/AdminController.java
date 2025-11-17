package Midas.cosmeticshop.controller;

import Midas.cosmeticshop.dto.BadKeywordDTO;
import Midas.cosmeticshop.dto.CouponPostDTO;
import Midas.cosmeticshop.dto.ReviewGetDTO;
import Midas.cosmeticshop.dto.UserInfo.UserDetailDTO;
import Midas.cosmeticshop.dto.UserInfo.UserListDTO;
import Midas.cosmeticshop.dto.UserInfo.UserUpdateDTO;
import Midas.cosmeticshop.dto.order.OrderDTO;
import Midas.cosmeticshop.service.AdminService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;

    public AdminController (AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping
    public String adminP() {
        return "Admin Controller";
    }

    @GetMapping("/bad-keywords")
    public ResponseEntity<List<BadKeywordDTO>> getBadKeywords (Authentication authentication) {
        return ResponseEntity.ok().body(adminService.getBadkeywords(authentication.getName()));
    }

    @PostMapping("/bad-keywords")
    public ResponseEntity<Void> postBadKeyword(@RequestParam("badKeyword") String badKeyword, Authentication authentication) {
        adminService.postBadKeyword(badKeyword, authentication.getName());
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/bad-keywords/{badKeywordId}")
    public ResponseEntity<Void> deleteBadKeyword(@PathVariable Long badKeywordId, Authentication authentication) {
        adminService.deleteBadKeyword(badKeywordId, authentication.getName());
        return ResponseEntity.ok().build();
    }

    @GetMapping("/reviews/bad")
    public ResponseEntity<List<ReviewGetDTO>> getBadReviews(Authentication authentication) {
        return ResponseEntity.ok().body(adminService.getBadReviews(authentication.getName()));
    }

    @DeleteMapping("/reviews/bad-keywords/all")
    public ResponseEntity<Void> deleteAllReviewsWithBadKeywords(Authentication authentication) {
        adminService.deleteBadReviews(authentication.getName());
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/reviews/{reviewId}")
    public ResponseEntity<Void> deleteReview(@PathVariable Long reviewId,
                                             Authentication authentication) {
        adminService.deleteReview(reviewId, authentication.getName());
        return ResponseEntity.ok().build();
    }

    @PostMapping("/coupons")
    public ResponseEntity<Void> postCoupon(@RequestBody CouponPostDTO couponPostDTO,
                                           Authentication authentication) {
        adminService.postCoupon(couponPostDTO, authentication.getName());
        return ResponseEntity.ok().build();
    }

    /* ===============================
       사용자 관리 기능
       =============================== */

    /**
     * 사용자 목록 조회 (페이징, 검색)
     */
    @GetMapping("/users")
    public ResponseEntity<Page<UserListDTO>> getUserList(
            @RequestParam(value = "keyword", required = false) String keyword,
            @PageableDefault(size = 10) Pageable pageable,
            Authentication authentication) {
        Page<UserListDTO> users = adminService.getUserList(authentication.getName(), keyword, pageable);
        return ResponseEntity.ok(users);
    }

    /**
     * 사용자 주문 내역 조회 (더 구체적인 경로를 먼저 배치)
     */
    @GetMapping(value = "/users/{userId}/orders", produces = "application/json")
    public ResponseEntity<List<OrderDTO>> getUserOrders(
            @PathVariable("userId") Long userId,
            Authentication authentication) {
        List<OrderDTO> orders = adminService.getUserOrders(authentication.getName(), userId);
        return ResponseEntity.ok(orders);
    }

    /**
     * 사용자 리뷰 목록 조회 (더 구체적인 경로를 먼저 배치)
     */
    @GetMapping("/users/{userId}/reviews")
    public ResponseEntity<List<ReviewGetDTO>> getUserReviews(
            @PathVariable("userId") Long userId,
            Authentication authentication) {
        List<ReviewGetDTO> reviews = adminService.getUserReviews(authentication.getName(), userId);
        return ResponseEntity.ok(reviews);
    }

    /**
     * 사용자 상세 정보 조회
     */
    @GetMapping("/users/{userId}")
    public ResponseEntity<UserDetailDTO> getUserDetail(
            @PathVariable Long userId,
            Authentication authentication) {
        UserDetailDTO userDetail = adminService.getUserDetail(authentication.getName(), userId);
        return ResponseEntity.ok(userDetail);
    }

    /**
     * 사용자 정보 수정
     */
    @PutMapping("/users/{userId}")
    public ResponseEntity<?> updateUser(
            @PathVariable Long userId,
            @RequestBody UserUpdateDTO updateDTO,
            Authentication authentication) {
        try {
            adminService.updateUser(authentication.getName(), userId, updateDTO);
            return ResponseEntity.ok().build();
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
