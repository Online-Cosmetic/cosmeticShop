package Midas.cosmeticshop.repository;

import Midas.cosmeticshop.entity.CouponMapping;

import java.util.List;

public interface CouponMappingRepository {
    List<CouponMapping> findByUserUserId(String userId);
}
