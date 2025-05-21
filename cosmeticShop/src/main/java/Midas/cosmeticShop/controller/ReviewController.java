package Midas.cosmeticshop.controller;

import Midas.cosmeticshop.dto.ReviewGetDTO;
import Midas.cosmeticshop.dto.ReviewPostDTO;
import Midas.cosmeticshop.dto.ReviewPutDTO;
import Midas.cosmeticshop.service.ReviewService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @GetMapping
    public ResponseEntity<List<ReviewGetDTO>> getReview (@RequestParam("ProductId") Long productId,
                                                         Authentication authentication) {
        if (authentication==null || !authentication.isAuthenticated() || authentication instanceof AnonymousAuthenticationToken)
            return ResponseEntity.ok().body(reviewService.getReview(productId, null));
        else
            return ResponseEntity.ok().body(reviewService.getReview(productId, authentication.getName()));
    }

    @GetMapping("/me")
    public ResponseEntity<List<ReviewGetDTO>> getMyReview (@RequestParam("productId") Long productId,
                                                           Authentication authentication) {
        return ResponseEntity.ok().body(reviewService.getMyReview(productId, authentication.getName()));
    }

    @PostMapping
    public ResponseEntity<Void> postReview (@RequestBody ReviewPostDTO reviewPostDTO,
                                            Authentication authentication) {
        reviewService.postReview(reviewPostDTO, authentication.getName());
        return ResponseEntity.ok().build();
    }

    //rating도 수정되게 할건지?
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


}
