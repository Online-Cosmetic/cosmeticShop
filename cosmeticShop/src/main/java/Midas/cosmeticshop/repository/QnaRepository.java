package Midas.cosmeticshop.repository;

import Midas.cosmeticshop.entity.Qna;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface QnaRepository extends JpaRepository<Qna, Long> {
//    아래 메소드와 동일한데, 파라미터로 Long 을 받는 예약 메소드라 findByUserId 사용 불가능해서 작성함
//    @Query("select q from Qna q where q.user.userId = :userId")
//    List<Qna> findByUserId(String userId);
    List<Qna> findByUserUserId(String userId);
    Optional<Qna> findById (Long id);
    List<Qna> findByUserNickNameContaining (String nickName);
    List<Qna> findByQuestionTitleContaining (String questionTitle);
}
