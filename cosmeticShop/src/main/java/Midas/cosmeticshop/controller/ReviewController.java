package Midas.cosmeticshop.controller;

import Midas.cosmeticshop.dto.ReviewDTO;
import Midas.cosmeticshop.dto.ReviewPostDTO;
import Midas.cosmeticshop.dto.ReviewPutDTO;
import Midas.cosmeticshop.service.ReviewService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class ReviewController {

    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @GetMapping("/reviews")
    public ResponseEntity<List<ReviewDTO>> getReview (@RequestParam("ProductId") Long productId) {
        return ResponseEntity.ok().body(reviewService.getReview(productId));
    }

    @PostMapping("/reviews")
    public ResponseEntity<Void> postReview (@RequestBody ReviewPostDTO reviewPostDTO,
                                            Authentication authentication) {
        reviewService.postReview(reviewPostDTO, authentication.getName());
        return ResponseEntity.ok().build();
    }

    //rating도 수정되게 할건지?
    @PutMapping("/reviews/{reviewId}")
    public ResponseEntity<Void> putReview (@PathVariable("reviewId") Long id,
                                           @RequestBody ReviewPutDTO reviewPutDTO,
                                           Authentication authentication) {
        reviewService.putReview(id, reviewPutDTO, authentication.getName());
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/review/{reviewId}")
    public ResponseEntity<Void> deleteReview(@PathVariable("reviewId") Long id,
                                             Authentication authentication) {
        reviewService.deleteReview(id, authentication.getName());
        return ResponseEntity.ok().build();
    }


}
