package Midas.cosmeticshop.controller;

import Midas.cosmeticshop.dto.ReviewGetDTO;
import Midas.cosmeticshop.dto.ReviewPostDTO;
import Midas.cosmeticshop.dto.ReviewPutDTO;
import Midas.cosmeticshop.service.ReviewService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @GetMapping
    public ResponseEntity<List<ReviewGetDTO>> getReview (@RequestParam("productId") Long productId,
                                                         Authentication authentication) {
        if (authentication==null || !authentication.isAuthenticated() || authentication instanceof AnonymousAuthenticationToken)
            return ResponseEntity.ok().body(reviewService.getReview(productId, null));
        else
            return ResponseEntity.ok().body(reviewService.getReview(productId, authentication.getName()));
    }

    @GetMapping("/me")
    public ResponseEntity<List<ReviewGetDTO>> getMyReview(
        @RequestParam(value = "productId", required = false) Long productId,
        Authentication authentication) {

        if (productId != null) {
            // 특정 상품에 대한 내 리뷰만 가져오기
            return ResponseEntity.ok().body(reviewService.getMyReview(productId, authentication.getName()));
        } else {
            // 내가 작성한 모든 리뷰 가져오기
            return ResponseEntity.ok().body(reviewService.getAllMyReviews(authentication.getName()));
        }
    }

    @PostMapping
    public ResponseEntity<Void> postReview (@RequestBody ReviewPostDTO reviewPostDTO,
                                            Authentication authentication) {
        reviewService.postReview(reviewPostDTO, authentication.getName());
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{reviewId}")
    public ResponseEntity<Void> putReview (@PathVariable("reviewId") Long id,
                                           @RequestBody ReviewPutDTO reviewPutDTO,
                                           Authentication authentication) {
        reviewService.putReview(id, reviewPutDTO, authentication.getName());
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{reviewId}")
    public ResponseEntity<Void> deleteReview(@PathVariable("reviewId") Long id,
                                             Authentication authentication) {
        reviewService.deleteReview(id, authentication.getName());
        return ResponseEntity.ok().build();
    }

    @PostMapping("/images")
    public ResponseEntity<List<String>> uploadImages(
        @RequestParam("images") List<MultipartFile> images,
        Authentication authentication) {

        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        List<String> imageUrls = reviewService.saveImages(images);
        return ResponseEntity.ok(imageUrls);
    }
}
