package Midas.cosmeticShop.repository.Users;

import Midas.cosmeticShop.entity.Users.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;


public interface UserRepository extends JpaRepository<User, Long> {
    Boolean existsByUserId(String userId);
    Boolean existsByNickName(String nickName);
    Boolean existsByEmailAddress(String email);
//    User findByUserId(String userId);
    Optional<User> findByUserId(String userId);
//    User findByUserId(String userId);
    Optional<User> findByUsername(String username);

}
