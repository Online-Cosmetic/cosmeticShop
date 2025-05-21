package Midas.cosmeticshop.controller;

import Midas.cosmeticshop.dto.BadKeywordDTO;
import Midas.cosmeticshop.dto.ReviewGetDTO;
import Midas.cosmeticshop.service.AdminService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class AdminController {

    private final AdminService adminService;

    public AdminController (AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/admin")
    public String adminP() {
        return "Admin Controller";
    }

    @GetMapping("/admin/bad-keywords")
    public ResponseEntity<List<BadKeywordDTO>> getBadKeywords (Authentication authentication) {
        return ResponseEntity.ok().body(adminService.getBadkeywords(authentication.getName()));
    }

    @PostMapping("/admin/bad-keywords")
    public ResponseEntity<Void> postBadKeyword(@RequestParam("badKeyword") String badKeyword ,Authentication authentication) {
        adminService.postBadKeyword(badKeyword, authentication.getName());
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/admin/bad-keywords/{badKeywordId}")
    public ResponseEntity<Void> deleteBadKeyword(@PathVariable Long badKeywordId, Authentication authentication) {
        adminService.deleteBadKeyword(badKeywordId, authentication.getName());
        return ResponseEntity.ok().build();
    }

    @GetMapping("/admin/reviews/bad")
    public ResponseEntity<List<ReviewGetDTO>> getBadReviews(Authentication authentication) {
        return ResponseEntity.ok().body(adminService.getBadReviews(authentication.getName()));
    }

    @DeleteMapping("/admin/reviews/bad")
    public ResponseEntity<Void> deleteBadReviews(Authentication authentication) {
        adminService.deleteBadReviews(authentication.getName());
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/admin/reviews/{reviewId}")
    public ResponseEntity<Void> deleteReview(@PathVariable Long reviewId, Authentication authentication) {
        adminService.deleteReview(reviewId, authentication.getName());
        return ResponseEntity.ok().build();
    }
}
