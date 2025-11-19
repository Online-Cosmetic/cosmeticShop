package Midas.cosmeticshop.repository;

import Midas.cosmeticshop.entity.Cart;
import Midas.cosmeticshop.entity.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface CartRepository extends JpaRepository<Cart, Long> {
    List<Cart> findByUserId(Long id);

    List<Cart> getAllByUser(User user);

    List<Cart> findAllByIdAndUser(Long id, User user);

    List<Cart> findAllByIdAndUserId(Long id, Long userId);

    // AiTEMS용: 모든 장바구니 데이터 조회 (User와 Product를 함께 로드)
    @Query("SELECT c FROM Cart c JOIN FETCH c.user JOIN FETCH c.product")
    List<Cart> findAllCartsForAitems();
}
