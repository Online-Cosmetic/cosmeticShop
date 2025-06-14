package Midas.cosmeticshop.repository;

import Midas.cosmeticshop.entity.CouponMapping;
import Midas.cosmeticshop.entity.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface CouponMappingRepository extends JpaRepository<CouponMapping, Long> {
    List<CouponMapping> findByUserUserId(String userId);
    List<CouponMapping> findByUser(User user);
    
    // 사용자별, 회사별 사용 가능한 쿠폰 조회
    @Query("SELECT cm FROM CouponMapping cm " +
           "JOIN cm.coupon c " +
           "WHERE cm.user.userId = :userId " +
           "AND c.company.id = :companyId " +
           "AND cm.isUsed = false " +
           "AND cm.expirationDate > :now")
    List<CouponMapping> findAvailableCouponsByUserIdAndCompanyId(
            @Param("userId") String userId,
            @Param("companyId") Long companyId,
            @Param("now") LocalDateTime now);
}