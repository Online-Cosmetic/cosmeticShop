package Midas.cosmeticshop.repository;

import Midas.cosmeticshop.entity.Cart;
import Midas.cosmeticshop.entity.user.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CartRepository extends JpaRepository<Cart, Long> {
    List<Cart> findByUserId(Long id);

    List<Cart> getAllByUser(User user);

    List<Cart> findAllByIdAndUser(Long id, User user);

    List<Cart> findAllByIdAndUserId(Long id, Long userId);
}
