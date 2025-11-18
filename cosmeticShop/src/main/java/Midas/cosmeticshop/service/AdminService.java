package Midas.cosmeticshop.service;

import Midas.cosmeticshop.dto.BadKeywordDTO;
import Midas.cosmeticshop.dto.CompanyApprovalDTO;
import Midas.cosmeticshop.dto.CouponPostDTO;
import Midas.cosmeticshop.dto.ReviewGetDTO;
import Midas.cosmeticshop.dto.UserInfo.UserDetailDTO;
import Midas.cosmeticshop.dto.UserInfo.UserListDTO;
import Midas.cosmeticshop.dto.UserInfo.UserUpdateDTO;
import Midas.cosmeticshop.dto.order.OrderDTO;
import Midas.cosmeticshop.entity.BadKeyword;
import Midas.cosmeticshop.entity.Coupon;
import Midas.cosmeticshop.entity.Order;
import Midas.cosmeticshop.entity.Review;
import Midas.cosmeticshop.entity.user.Admin;
import Midas.cosmeticshop.entity.user.Company;
import Midas.cosmeticshop.entity.user.User;
import Midas.cosmeticshop.repository.BadKeywordRepository;
import Midas.cosmeticshop.repository.CouponRepository;
import Midas.cosmeticshop.repository.OrderRepository;
import Midas.cosmeticshop.repository.ReviewRepository;
import Midas.cosmeticshop.repository.user.AdminRepository;
import Midas.cosmeticshop.repository.user.CompanyRepository;
import Midas.cosmeticshop.repository.user.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
    private final UserRepository userRepository;
    private final OrderRepository orderRepository;

    public AdminService (ReviewRepository ReviewRepo,
                         BadKeywordRepository BadKeywordRepo,
                         AdminRepository adminRepo,
                         CompanyRepository CompanyRepo,
                         CouponRepository CouponRepo,
                         UserRepository userRepository,
                         OrderRepository orderRepository) {
        this.ReviewRepo = ReviewRepo;
        this.BadKeywordRepo = BadKeywordRepo;
        this.adminRepo = adminRepo;
        this.CompanyRepo = CompanyRepo;
        this.CouponRepo = CouponRepo;
        this.userRepository = userRepository;
        this.orderRepository = orderRepository;
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
        coupon.setDiscountRate(couponPostDTO.getDiscountRate());
        coupon.setDuration(couponPostDTO.getDuration());
        coupon.setCompany(company);

        CouponRepo.save(coupon);
    }

    /* ===============================
       사용자 관리 기능
       =============================== */

    /**
     * 사용자 목록 조회 (페이징, 검색)
     */
    public Page<UserListDTO> getUserList(String adminUserId, String keyword, Pageable pageable) {
        validateAdmin(adminUserId);
        return userRepository.findAllWithSearch(keyword, pageable)
                .map(UserListDTO::from);
    }

    /**
     * 사용자 상세 정보 조회
     */
    public UserDetailDTO getUserDetail(String adminUserId, Long userId) {
        validateAdmin(adminUserId);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("사용자를 찾을 수 없습니다. id=" + userId));
        return UserDetailDTO.from(user);
    }

    /**
     * 사용자 정보 수정
     */
    @Transactional
    public void updateUser(String adminUserId, Long userId, UserUpdateDTO updateDTO) {
        validateAdmin(adminUserId);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("사용자를 찾을 수 없습니다. id=" + userId));

        // 닉네임 중복 체크 (다른 사용자가 사용 중인지 확인)
        if (updateDTO.getNickname() != null && !updateDTO.getNickname().equals(user.getNickName())) {
            if (userRepository.existsByNickName(updateDTO.getNickname())) {
                throw new IllegalStateException("이미 사용 중인 닉네임 입니다!");
            }
            user.setNickName(updateDTO.getNickname());
        }

        // 이메일 중복 체크 (다른 사용자가 사용 중인지 확인)
        if (updateDTO.getEmail() != null && !updateDTO.getEmail().equals(user.getEmailAddress())) {
            if (userRepository.existsByEmailAddress(updateDTO.getEmail())) {
                throw new IllegalStateException("이미 사용 중인 이메일 입니다!");
            }
            user.setEmailAddress(updateDTO.getEmail());
        }

        if (updateDTO.getUsername() != null) {
            user.setUsername(updateDTO.getUsername());
        }
        if (updateDTO.getAge() != null) {
            user.setAge(updateDTO.getAge());
        }

        userRepository.save(user);
    }

    /**
     * 사용자 주문 내역 조회
     */
    @Transactional(readOnly = true)
    public List<OrderDTO> getUserOrders(String adminUserId, Long userId) {
        validateAdmin(adminUserId);
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("사용자를 찾을 수 없습니다. id=" + userId));
        
        // OrderService.getMyOrders()와 동일한 방식으로 조회
        // findAllByUser는 Optional<List<Order>>를 반환하므로 orElse로 처리
        List<Order> orderList = orderRepository.findAllByUser(user)
                .orElse(new ArrayList<>());
        
        // 트랜잭션 범위 내에서 DTO 변환 (lazy loading이 작동하도록)
        return orderList.stream()
                .map(Order::toDTO)
                .collect(java.util.stream.Collectors.toList());
    }

    /**
     * 사용자 리뷰 목록 조회
     */
    @Transactional(readOnly = true)
    public List<ReviewGetDTO> getUserReviews(String adminUserId, Long userId) {
        validateAdmin(adminUserId);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("사용자를 찾을 수 없습니다. id=" + userId));
        
        List<Review> reviewList = ReviewRepo.findByUserUserId(user.getUserId());
        List<ReviewGetDTO> reviewDTOList = new ArrayList<>();
        
        for (Review review : reviewList) {
            reviewDTOList.add(new ReviewGetDTO(review, false));
        }
        
        return reviewDTOList;
    }

    /**
     * 관리자 권한 검증 헬퍼 메서드
     */
    private void validateAdmin(String userId) {
        Admin admin = adminRepo.findByUserId(userId)
                .orElseThrow(() -> new EntityNotFoundException("사용자가 존재하지 않습니다."));
        if (!admin.getRole().equals("ADMIN")) {
            throw new AccessDeniedException("관리자만 접근 가능합니다.");
        }
    }

    /* ===============================
       기업 회원 승인 관리 기능
       =============================== */

    /**
     * CompanyApprovalDTO 리스트 정렬 헬퍼 메서드
     */
    private List<CompanyApprovalDTO> sortByCreatedAtDesc(List<CompanyApprovalDTO> list) {
        return list.stream()
                .sorted((a, b) -> {
                    // null 체크
                    if (a.getCreatedAt() == null && b.getCreatedAt() == null) return 0;
                    if (a.getCreatedAt() == null) return 1;
                    if (b.getCreatedAt() == null) return -1;
                    return b.getCreatedAt().compareTo(a.getCreatedAt()); // 최신순 정렬
                })
                .collect(java.util.stream.Collectors.toList());
    }

    /**
     * 승인 대기 중인 기업 회원 목록 조회
     */
    public List<CompanyApprovalDTO> getPendingApprovalCompanies(String adminUserId) {
        validateAdmin(adminUserId);
        List<Company> companies = CompanyRepo.findPendingApprovalCompanies();
        List<CompanyApprovalDTO> dtos = companies.stream()
                .map(this::convertToCompanyApprovalDTO)
                .collect(java.util.stream.Collectors.toList());
        return sortByCreatedAtDesc(dtos);
    }

    /**
     * 승인된 기업 회원 목록 조회
     */
    public List<CompanyApprovalDTO> getApprovedCompanies(String adminUserId) {
        validateAdmin(adminUserId);
        List<Company> companies = CompanyRepo.findApprovedCompanies();
        List<CompanyApprovalDTO> dtos = companies.stream()
                .map(this::convertToCompanyApprovalDTO)
                .collect(java.util.stream.Collectors.toList());
        return sortByCreatedAtDesc(dtos);
    }

    /**
     * 전체 기업 회원 목록 조회 (승인 상태 필터 옵션, 페이징, 검색)
     */
    public Page<CompanyApprovalDTO> getAllCompanies(String adminUserId, Boolean approved, String keyword, Pageable pageable) {
        validateAdmin(adminUserId);
        Page<Company> companies = CompanyRepo.findAllWithSearch(approved, keyword, pageable);
        return companies.map(this::convertToCompanyApprovalDTO);
    }

    /**
     * 기업 회원 상세 정보 조회
     */
    public CompanyApprovalDTO getCompanyDetail(String adminUserId, Long companyId) {
        validateAdmin(adminUserId);
        Company company = CompanyRepo.findById(companyId)
                .orElseThrow(() -> new EntityNotFoundException("기업 회원을 찾을 수 없습니다. id=" + companyId));
        return convertToCompanyApprovalDTO(company);
    }

    /**
     * 기업 회원 승인
     */
    @Transactional
    public void approveCompany(String adminUserId, Long companyId) {
        validateAdmin(adminUserId);
        Company company = CompanyRepo.findById(companyId)
                .orElseThrow(() -> new EntityNotFoundException("기업 회원을 찾을 수 없습니다. id=" + companyId));
        company.setApproved(true);
        CompanyRepo.save(company);
    }

    /**
     * 기업 회원 거절 (삭제)
     */
    @Transactional
    public void rejectCompany(String adminUserId, Long companyId) {
        validateAdmin(adminUserId);
        Company company = CompanyRepo.findById(companyId)
                .orElseThrow(() -> new EntityNotFoundException("기업 회원을 찾을 수 없습니다. id=" + companyId));
        CompanyRepo.delete(company);
    }

    /**
     * Company 엔티티를 CompanyApprovalDTO로 변환
     */
    private CompanyApprovalDTO convertToCompanyApprovalDTO(Company company) {
        CompanyApprovalDTO dto = new CompanyApprovalDTO();
        dto.setId(company.getId());
        dto.setUserId(company.getUserId());
        dto.setCompanyName(company.getCompanyName());
        dto.setEmail(company.getEmailAddress());
        dto.setPhoneNumber(company.getPhoneNumber());
        dto.setBusinessRegistrationNumber(company.getBusinessRegistrationNumber());
        dto.setRepresentativeName(company.getRepresentativeName());
        dto.setBusinessType(company.getBusinessType());
        dto.setBusinessAddress(company.getBusinessAddress());
        dto.setContactPersonName(company.getContactPersonName());
        dto.setContactPhoneNumber(company.getContactPhoneNumber());
        dto.setBusinessLicensePath(company.getBusinessLicensePath());
        dto.setApproved(company.isApproved());
        dto.setCreatedAt(company.getCreatedAt());
        return dto;
    }

}
