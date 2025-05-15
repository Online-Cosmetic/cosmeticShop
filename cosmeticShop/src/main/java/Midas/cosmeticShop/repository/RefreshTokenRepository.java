package Midas.cosmeticShop.repository;

import Midas.cosmeticShop.entity.RefreshToken;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {
    // BaseUser의 모든 서브타입(User, Company, Admin)을 한 번에 처리
    void deleteByUserId(String userId);
    Optional<RefreshToken> findByToken(String token);
    void deleteAllByUserId(String userId);
    Boolean existsByToken(RefreshToken token);
}
