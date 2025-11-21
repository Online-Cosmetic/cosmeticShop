package Midas.cosmeticshop.controller;

import Midas.cosmeticshop.dto.BadKeywordDTO;
import Midas.cosmeticshop.dto.CompanyApprovalDTO;
import Midas.cosmeticshop.dto.BadKeywordRequest;
import Midas.cosmeticshop.dto.CompanyQnaDetailDTO;
import Midas.cosmeticshop.dto.CompanyQnaListDTO;
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

    /* ===============================
       기업 회원 승인 관리 기능
       =============================== */

    /**
     * 승인 대기 중인 기업 회원 목록 조회
     */
    @GetMapping("/companies/pending")
    public ResponseEntity<List<CompanyApprovalDTO>> getPendingApprovalCompanies(
            Authentication authentication) {
        List<CompanyApprovalDTO> companies = adminService.getPendingApprovalCompanies(authentication.getName());
        return ResponseEntity.ok(companies);
    }

    /**
     * 전체 기업 회원 목록 조회 (승인 상태 필터 옵션, 페이징, 검색)
     */
    @GetMapping("/companies")
    public ResponseEntity<Page<CompanyApprovalDTO>> getAllCompanies(
            @RequestParam(value = "approved", required = false) Boolean approved,
            @RequestParam(value = "keyword", required = false) String keyword,
            @PageableDefault(size = 10) Pageable pageable,
            Authentication authentication) {
        Page<CompanyApprovalDTO> companies = adminService.getAllCompanies(authentication.getName(), approved, keyword, pageable);
        return ResponseEntity.ok(companies);
    }

    /**
     * 기업 회원 상세 정보 조회
     */
    @GetMapping("/companies/{companyId}")
    public ResponseEntity<CompanyApprovalDTO> getCompanyDetail(
            @PathVariable Long companyId,
            Authentication authentication) {
        CompanyApprovalDTO company = adminService.getCompanyDetail(authentication.getName(), companyId);
        return ResponseEntity.ok(company);
    }

    /**
     * 기업 회원 승인
     */
    @PostMapping("/companies/{companyId}/approve")
    public ResponseEntity<Void> approveCompany(
            @PathVariable Long companyId,
            Authentication authentication) {
        adminService.approveCompany(authentication.getName(), companyId);
        return ResponseEntity.ok().build();
    }

    /**
     * 기업 회원 거절
     */
    @DeleteMapping("/companies/{companyId}")
    public ResponseEntity<Void> rejectCompany(
            @PathVariable Long companyId,
            Authentication authentication) {
        adminService.rejectCompany(authentication.getName(), companyId);
        return ResponseEntity.ok().build();
    }
    
    /* 기업 QnA 관리 엔드포인트 */

    // 전체 기업 QnA 목록 조회
    @GetMapping("/company-qnas")
    public ResponseEntity<List<CompanyQnaListDTO>> getAllCompanyQnas(Authentication authentication) {
        return ResponseEntity.ok().body(adminService.getAllCompanyQnas(authentication.getName()));
    }

    // 답변 완료 기업 QnA 목록
    @GetMapping("/company-qnas/answered")
    public ResponseEntity<List<CompanyQnaListDTO>> getAnsweredCompanyQnas(Authentication authentication) {
        return ResponseEntity.ok().body(adminService.getAnsweredCompanyQnas(authentication.getName()));
    }

    // 답변 대기 기업 QnA 목록
    @GetMapping("/company-qnas/unanswered")
    public ResponseEntity<List<CompanyQnaListDTO>> getUnansweredCompanyQnas(Authentication authentication) {
        return ResponseEntity.ok().body(adminService.getUnansweredCompanyQnas(authentication.getName()));
    }

    // 기업 QnA 상세 조회
    @GetMapping("/company-qnas/{id}")
    public ResponseEntity<CompanyQnaDetailDTO> getCompanyQnaDetail(@PathVariable Long id, Authentication authentication) {
        return ResponseEntity.ok().body(adminService.getCompanyQnaDetail(id, authentication.getName()));
    }

    // 기업 QnA 답변 작성/수정
    @PutMapping("/company-qnas/{id}/answers")
    public ResponseEntity<Void> putCompanyQnaAnswer(@PathVariable Long id,
                                                     @RequestParam("answer") String answer,
                                                     Authentication authentication) {
        adminService.putCompanyQnaAnswer(id, answer, authentication.getName());
        return ResponseEntity.ok().build();
    }

    // 기업 QnA 삭제
    @DeleteMapping("/company-qnas/{id}")
    public ResponseEntity<Void> adminDeleteCompanyQna(@PathVariable Long id, Authentication authentication) {
        adminService.adminDeleteCompanyQna(id, authentication.getName());
        return ResponseEntity.ok().build();
    }

    // 답변완료 + 제목 검색
    @GetMapping("/company-qnas/answered/search")
    public ResponseEntity<List<CompanyQnaListDTO>> searchAnsweredCompanyQnasByTitle(@RequestParam("title") String title,
                                                                                     Authentication authentication) {
        return ResponseEntity.ok().body(adminService.getAnsweredCompanyQnasByTitle(title, authentication.getName()));
    }

    // 답변대기 + 제목 검색
    @GetMapping("/company-qnas/unanswered/search")
    public ResponseEntity<List<CompanyQnaListDTO>> searchUnansweredCompanyQnasByTitle(@RequestParam("title") String title,
                                                                                      Authentication authentication) {
        return ResponseEntity.ok().body(adminService.getUnansweredCompanyQnasByTitle(title, authentication.getName()));
    }
}
