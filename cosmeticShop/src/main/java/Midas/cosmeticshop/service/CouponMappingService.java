package Midas.cosmeticshop.service;

import Midas.cosmeticshop.dto.CouponDTO;
import Midas.cosmeticshop.dto.CouponMappingDto;
import Midas.cosmeticshop.dto.CouponMappingGetDTO;
import Midas.cosmeticshop.entity.Coupon;
import Midas.cosmeticshop.entity.CouponMapping;
import Midas.cosmeticshop.entity.user.User;
import Midas.cosmeticshop.repository.CouponMappingRepository;
import Midas.cosmeticshop.repository.CouponRepository;
import Midas.cosmeticshop.repository.user.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.hibernate.dialect.function.array.ArrayContainsArgumentTypeResolver;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class CouponMappingService {

    private final CouponMappingRepository CouponMappingRepo;
    private final UserRepository UserRepo;
    private final CouponRepository CouponRepo;

    public CouponMappingService (CouponMappingRepository CouponMappingRepo, UserRepository UserRepo, CouponRepository CouponRepo) {
        this.CouponMappingRepo = CouponMappingRepo;
        this.UserRepo = UserRepo;
        this.CouponRepo = CouponRepo;
    }

    public List<CouponMappingGetDTO> GetCouponMapping (String userId) {
        List<CouponMapping> couponMappingList = CouponMappingRepo.findByUserUserId(userId);
        List<CouponMappingGetDTO> couponMappingGetDTOList = new ArrayList<>();
        for(CouponMapping couponMapping : couponMappingList) {
            couponMappingGetDTOList.add(new CouponMappingGetDTO(couponMapping));
        }
        return couponMappingGetDTOList;
    }

    public void postCouponMapping (Long couponId, String userId) {
        User user = UserRepo.findByUserId(userId)
                .orElseThrow(() -> new EntityNotFoundException("사용자가 존재하지 않습니다"));
        Coupon coupon = CouponRepo.findById(couponId)
                .orElseThrow(() -> new EntityNotFoundException("쿠폰이 존재하지 않습니다"));
        CouponMapping couponMapping = new CouponMapping();
        couponMapping.setCoupon(coupon);
        couponMapping.setUser(user);
        couponMapping.setIssuedDate(LocalDateTime.now());
        couponMapping.setExpirationDate(LocalDateTime.now().plusDays(coupon.getDuration()));
        CouponMappingRepo.save(couponMapping);
    }


    public List<CouponDTO> getAvailableCouponsByCompany(Long companyId, String userId) {
        // 1. 해당 회사의 모든 유효한 쿠폰을 가져옴
        List<Coupon> companyCoupons = CouponRepo.findByCompanyId(companyId);

        // 2. 사용자가 이미 가지고 있는 쿠폰 ID 목록 조회 (인증된 사용자가 있는 경우만)
        Set<Long> userCouponIds;
        if (userId != null) {
            User user = UserRepo.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

            // CouponRepo 대신 CouponMappingRepo 사용
            List<CouponMapping> userCoupons = CouponMappingRepo.findByUser(user);
            userCouponIds = userCoupons.stream()
                .map(mapping -> mapping.getCoupon().getId())
                .collect(Collectors.toSet());
        } else {
            userCouponIds = new HashSet<>();
        }

        // 3. 사용자가 가지고 있지 않은 쿠폰만 필터링하여 DTO로 변환
        return companyCoupons.stream()
            .filter(coupon -> !userCouponIds.contains(coupon.getId()))
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }

    /**
     * 주문 상품별로 사용 가능한 쿠폰 목록을 조회합니다.
     *
     * @param userId 사용자 ID
     * @param companyId 회사 ID
     * @return 사용 가능한 쿠폰 목록
     */
    public List<CouponMappingGetDTO> getAvailableCouponsForOrder(String userId, Long companyId) {
        // 현재 시간 기준으로 만료되지 않은 쿠폰만 조회
        LocalDateTime now = LocalDateTime.now();

        List<CouponMapping> coupons = CouponMappingRepo
            .findAvailableCouponsByUserIdAndCompanyId(userId, companyId, now);

        return coupons.stream()
            .map(CouponMappingGetDTO::new)
            .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<CouponMappingDto> getAvailableCoupons(String userId, Long companyId) {
        List<CouponMapping> mappings = CouponMappingRepo
            .findAvailableCouponsByUserIdAndCompanyId(userId, companyId, LocalDateTime.now());
        return mappings.stream()
            .map(cm -> new CouponMappingDto(
                cm.getId(),
                cm.getCoupon().getId(),
                cm.getCoupon().getCouponName(),
                cm.getCoupon().getDiscountRate(),
                cm.getExpirationDate()
            ))
            .collect(Collectors.toList());
    }

    // 쿠폰 엔티티를 DTO로 변환하는 도우미 메서드
    private CouponDTO convertToDTO(Coupon coupon) {
        CouponDTO dto = new CouponDTO();
        dto.setId(coupon.getId());
        dto.setCouponName(coupon.getCouponName());
        dto.setDiscountRate(coupon.getDiscountRate());
        dto.setDuration(coupon.getDuration());
        dto.setCompanyId(coupon.getCompany().getId());
        dto.setCompanyName(coupon.getCompany().getCompanyName());
        return dto;
    }
}
