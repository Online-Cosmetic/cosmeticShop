package Midas.cosmeticshop.service;

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

import java.util.ArrayList;
import java.util.List;

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
        Coupon coupon =
        CouponMapping couponMapping = new CouponMapping();
        couponMapping.setCoupon();

    }
}
