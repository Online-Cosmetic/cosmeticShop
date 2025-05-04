package Midas.cosmeticShop.repository;

import Midas.cosmeticShop.entity.RefreshToken;
import Midas.cosmeticShop.entity.Users.Admin;
import Midas.cosmeticShop.entity.Users.BaseUser;
import Midas.cosmeticShop.entity.Users.Company;
import Midas.cosmeticShop.entity.Users.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {
    // BaseUser의 모든 서브타입(User, Company, Admin)을 한 번에 처리
    void deleteByUser(BaseUser user);
    Optional<RefreshToken> findByToken(String token);
    void deleteAllByUserId(Long userId);
}
