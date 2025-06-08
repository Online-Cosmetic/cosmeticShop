package Midas.cosmeticshop.controller;

import Midas.cosmeticshop.service.ReviewLikeService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}
