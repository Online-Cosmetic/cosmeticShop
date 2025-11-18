package Midas.cosmeticshop.repository.user;

import Midas.cosmeticshop.entity.user.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;


public interface UserRepository extends JpaRepository<User, Long> {
    Boolean existsByUserId(String userId);
    Boolean existsByNickName(String nickName);
    Boolean existsByEmailAddress(String email);
    Optional<User> findByUserId(String userId);
    boolean existsByUserIdAndEmailAddress(String userId, String email);

    // 관리자용: 사용자 목록 조회 (검색, 페이징)
    @Query(value = "SELECT u FROM User u WHERE (:keyword IS NULL OR :keyword = '' OR LOWER(u.userId) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(u.nickName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(u.emailAddress) LIKE LOWER(CONCAT('%', :keyword, '%'))) ORDER BY u.createdAt DESC")
    Page<User> findAllWithSearch(@Param("keyword") String keyword, Pageable pageable);
}