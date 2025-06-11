package Midas.cosmeticshop.service;

import Midas.cosmeticshop.dto.BadKeywordDTO;
import Midas.cosmeticshop.dto.CouponPostDTO;
import Midas.cosmeticshop.dto.ReviewGetDTO;
import Midas.cosmeticshop.entity.BadKeyword;
import Midas.cosmeticshop.entity.Coupon;
import Midas.cosmeticshop.entity.Review;
import Midas.cosmeticshop.entity.user.Admin;
import Midas.cosmeticshop.entity.user.Company;
import Midas.cosmeticshop.repository.BadKeywordRepository;
import Midas.cosmeticshop.repository.CouponRepository;
import Midas.cosmeticshop.repository.ReviewRepository;
import Midas.cosmeticshop.repository.user.AdminRepository;
import Midas.cosmeticshop.repository.user.CompanyRepository;
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
    private final AdminRepository adminRepo;
    private final CompanyRepository CompanyRepo;
    private final CouponRepository CouponRepo;

    public AdminService (ReviewRepository ReviewRepo,
                         BadKeywordRepository BadKeywordRepo,
                         AdminRepository adminRepo,
                         CompanyRepository CompanyRepo,
                         CouponRepository CouponRepo) {
        this.ReviewRepo = ReviewRepo;
        this.BadKeywordRepo = BadKeywordRepo;
        this.adminRepo = adminRepo;
        this.CompanyRepo = CompanyRepo;
        this.CouponRepo = CouponRepo;
    }

    public List<BadKeywordDTO> getBadkeywords (String userId) {
        Admin user = adminRepo.findByUserId(userId)
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
        Admin user = adminRepo.findByUserId(userId)
            .orElseThrow(() -> new EntityNotFoundException("사용자가 존재하지 않습니다."));
        if (!user.getRole().equals("ADMIN"))
            throw new AccessDeniedException("관리자만 접근 가능합니다.");
        BadKeyword badKeyword = new BadKeyword();
        badKeyword.setKeyword(keyword);
        BadKeywordRepo.save(badKeyword);
    }

    public void deleteBadKeyword (Long badKeywordId, String userId) {
        Admin user = adminRepo.findByUserId(userId)
            .orElseThrow(() -> new EntityNotFoundException("사용자가 존재하지 않습니다."));
        if (!user.getRole().equals("ADMIN"))
            throw new AccessDeniedException("관리자만 접근 가능합니다.");
        BadKeyword badKeyword = BadKeywordRepo.findById(badKeywordId)
            .orElseThrow(() -> new EntityNotFoundException("키워드가 존재하지 않습니다."));
        BadKeywordRepo.delete(badKeyword);
    }

    public List<ReviewGetDTO> getBadReviews (String userId) {
        Admin user = adminRepo.findByUserId(userId)
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
        List<ReviewGetDTO> reviewDTOList = new ArrayList<>();
        for (Review review : badReviewList) {
            reviewDTOList.add(new ReviewGetDTO(review, false));
        }
        return reviewDTOList;
    }

    @Transactional
    public void deleteBadReviews (String userId) {
        Admin user = adminRepo.findByUserId(userId)
            .orElseThrow(() -> new EntityNotFoundException("사용자가 존재하지 않습니다."));
        if (!user.getRole().equals("ADMIN"))
            throw new AccessDeniedException("관리자만 접근 가능합니다.");
        List<BadKeyword> badKeywordList = BadKeywordRepo.findAll();
        for (BadKeyword badKeyword : badKeywordList) {
            ReviewRepo.deleteAllByContentContaining(badKeyword.getKeyword());
        }
    }

    public void deleteReview(Long reviewId, String userId) {
        Admin user = adminRepo.findByUserId(userId)
            .orElseThrow(() -> new EntityNotFoundException("사용자가 존재하지 않습니다."));
        if (!user.getRole().equals("ADMIN"))
            throw new AccessDeniedException("관리자만 접근 가능합니다.");
        Review review = ReviewRepo.findById(reviewId)
            .orElseThrow(() -> new EntityNotFoundException("리뷰가 존재하지 않습니다."));
        ReviewRepo.delete(review);
    }

    /* 새로운 쿠폰을 발행하는 메소드 */
    public void postCoupon(CouponPostDTO couponPostDTO, String userId) {
        Admin user = adminRepo.findByUserId(userId)
                .orElseThrow(() -> new EntityNotFoundException("사용자가 존재하지 않습니다."));
        if(!user.getRole().equals("ADMIN"))
            throw new AccessDeniedException("관리자만 접근 가능합니다.");
        Company company = CompanyRepo.findByCompanyName(couponPostDTO.getCompanyName())
                .orElseThrow(() -> new EntityNotFoundException("기업이 존재하지 않습니다."));

        Coupon coupon = new Coupon();
        coupon.setCouponName(couponPostDTO.getCouponName());
        coupon.setDiscountRate(coupon.getDiscountRate());
        coupon.setDuration(couponPostDTO.getDuration());
        coupon.setCompany(company);
        CouponRepo.save(coupon);
    }

}
