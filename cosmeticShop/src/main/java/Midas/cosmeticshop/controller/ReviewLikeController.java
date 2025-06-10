package Midas.cosmeticshop.controller;

import Midas.cosmeticshop.service.ReviewLikeService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;

@RestController
@RequestMapping("/api/reviews")
public class ReviewLikeController {

    private final ReviewLikeService reviewLikeService;

    public ReviewLikeController (ReviewLikeService reviewLikeService) {
        this.reviewLikeService = reviewLikeService;
    }

    @PostMapping("/{reviewId}/likes/toggle")
    public ResponseEntity<Boolean> toggleReviewLike (@PathVariable Long reviewId,
                                                  Authentication authentication) {
        return ResponseEntity.ok().body(reviewLikeService.toggleReviewLike(reviewId, authentication.getName()));
    }

    @GetMapping("/check-purchased/{productId}")
    public ResponseEntity<Boolean> checkPurchased(@PathVariable Long productId,
                                             Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated() || authentication instanceof AnonymousAuthenticationToken) {
            return ResponseEntity.ok(false);
        }
        return ResponseEntity.ok(reviewLikeService.checkPurchased(productId, authentication.getName()));
    }

    @GetMapping("/check-reviewed/{productId}")
    public ResponseEntity<Boolean> checkReviewed(@PathVariable Long productId,
                                            Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated() || authentication instanceof AnonymousAuthenticationToken) {
            return ResponseEntity.ok(false);
        }
        return ResponseEntity.ok(reviewLikeService.checkReviewed(productId, authentication.getName()));
    }
}