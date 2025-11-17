package Midas.cosmeticshop.controller;

import Midas.cosmeticshop.dto.BadKeywordDTO;
import Midas.cosmeticshop.dto.BadKeywordRequest;
import Midas.cosmeticshop.dto.CompanyQnaDetailDTO;
import Midas.cosmeticshop.dto.CompanyQnaListDTO;
import Midas.cosmeticshop.dto.CouponPostDTO;
import Midas.cosmeticshop.dto.ReviewGetDTO;
import Midas.cosmeticshop.service.AdminService;
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
        System.out.println(couponPostDTO.toString());
        adminService.postCoupon(couponPostDTO, authentication.getName());
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
