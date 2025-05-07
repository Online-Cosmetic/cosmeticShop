package Midas.cosmeticShop.repository;

import Midas.cosmeticShop.entity.Qna;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

public interface QnaRepository extends JpaRepository<Qna, Long> {
    List<Qna> findByUserUserId (String userId);
    Optional<Qna> findById (Long id);
    List<Qna> findByUserNickNameContaining (String nickName);
    List<Qna> findByQuestionTitleContaining (String questionTitle);
}
