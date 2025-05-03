package Midas.cosmeticShop.repository.Users;

import Midas.cosmeticShop.entity.Users.BaseUser;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface BaseUserRepository extends JpaRepository<BaseUser, Long> {
    Optional<BaseUser> findByUserId(String userId);
    boolean existsByUserId(String userId);
}
