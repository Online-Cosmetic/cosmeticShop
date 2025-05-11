package Midas.cosmeticshop.service;

import Midas.cosmeticshop.dto.BadKeywordDTO;
import Midas.cosmeticshop.dto.ReviewDTO;
import Midas.cosmeticshop.entity.BadKeyword;
import Midas.cosmeticshop.entity.Review;
import Midas.cosmeticshop.entity.user.User;
import Midas.cosmeticshop.repository.BadKeywordRepository;
import Midas.cosmeticshop.repository.ReviewRepository;
import Midas.cosmeticshop.repository.user.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;


@Service
public class AdminService {

    private final ReviewRepository ReviewRepo;
    private final BadKeywordRepository BadKeywordRepo;
    private final UserRepository UserRepo;

    public AdminService (ReviewRepository ReviewRepo, BadKeywordRepository BadKeywordRepo, UserRepository UserRepo) {
        this.ReviewRepo = ReviewRepo;
        this.BadKeywordRepo = BadKeywordRepo;
        this.UserRepo = UserRepo;
    }

    public List<BadKeywordDTO> getBadkeywords (String userId) {
        User user = UserRepo.findByUserId(userId)
            .orElseThrow(() -> new EntityNotFoundException("사용자가 존재하지 않습니다."));
        if (!user.getRole().equals("ADMIN"))
            throw new AccessDeniedException("관리자만 접근 가능합니다.");
        List<BadKeyword> badKeywordList = BadKeywordRepo.findAll();
        List<BadKeywordDTO> badKeywordDTOList = new ArrayList<>();
        for (BadKeyword badKeyword : badKeywordList) {
            badKeywordDTOList.add(new BadKeywordDTO(badKeyword));
        }
        return badKeywordDTOList;
    }

    public void postBadKeyword (String keyword, String userId) {
        User user = UserRepo.findByUserId(userId)
            .orElseThrow(() -> new EntityNotFoundException("사용자가 존재하지 않습니다."));
        if (!user.getRole().equals("ADMIN"))
            throw new AccessDeniedException("관리자만 접근 가능합니다.");
        BadKeyword badKeyword = new BadKeyword();
        badKeyword.setKeyword(keyword);
        BadKeywordRepo.save(badKeyword);
    }

    public void deleteBadKeyword (Long badKeywordId, String userId) {
        User user = UserRepo.findByUserId(userId)
            .orElseThrow(() -> new EntityNotFoundException("사용자가 존재하지 않습니다."));
        if (!user.getRole().equals("ADMIN"))
            throw new AccessDeniedException("관리자만 접근 가능합니다.");
        BadKeyword badKeyword = BadKeywordRepo.findById(badKeywordId)
            .orElseThrow(() -> new EntityNotFoundException("키워드가 존재하지 않습니다."));
        BadKeywordRepo.delete(badKeyword);
    }

    public List<ReviewDTO> getBadReviews (String userId) {
        User user = UserRepo.findByUserId(userId)
            .orElseThrow(() -> new EntityNotFoundException("사용자가 존재하지 않습니다."));
        if (!user.getRole().equals("ADMIN"))
            throw new AccessDeniedException("관리자만 접근 가능합니다.");
        List<BadKeyword> badKeywordList = BadKeywordRepo.findAll();
        Set<Review> reviewSet = new HashSet<>();
        for (BadKeyword badKeyword : badKeywordList) {
            List<Review> reviewList = ReviewRepo.findByContentContaining(badKeyword.getKeyword());
            reviewSet.addAll(reviewList);
        }
        List<Review> badReviewList = new ArrayList<>(reviewSet);
        List<ReviewDTO> reviewDTOList = new ArrayList<>();
        for (Review review : badReviewList) {
            reviewDTOList.add(new ReviewDTO(review));
        }
        return reviewDTOList;
    }

    @Transactional
    public void deleteBadReviews (String userId) {
        User user = UserRepo.findByUserId(userId)
            .orElseThrow(() -> new EntityNotFoundException("사용자가 존재하지 않습니다."));
        if (!user.getRole().equals("ADMIN"))
            throw new AccessDeniedException("관리자만 접근 가능합니다.");
        List<BadKeyword> badKeywordList = BadKeywordRepo.findAll();
        for (BadKeyword badKeyword : badKeywordList) {
            ReviewRepo.deleteAllByContentContaining(badKeyword.getKeyword());
        }
    }

    public void deleteReview(Long reviewId, String userId) {
        User user = UserRepo.findByUserId(userId)
            .orElseThrow(() -> new EntityNotFoundException("사용자가 존재하지 않습니다."));
        if (!user.getRole().equals("ADMIN"))
            throw new AccessDeniedException("관리자만 접근 가능합니다.");
        Review review = ReviewRepo.findById(reviewId)
            .orElseThrow(() -> new EntityNotFoundException("리뷰가 존재하지 않습니다."));
        ReviewRepo.delete(review);
    }

}
