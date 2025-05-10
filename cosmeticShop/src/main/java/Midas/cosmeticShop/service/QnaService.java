package Midas.cosmeticShop.service;

import Midas.cosmeticShop.dto.QnaDTO;
import Midas.cosmeticShop.dto.QnaListDTO;
import Midas.cosmeticShop.dto.QnaPostDTO;
import Midas.cosmeticShop.entity.Qna;
import Midas.cosmeticShop.entity.Users.User;
import Midas.cosmeticShop.repository.QnaRepository;
import Midas.cosmeticShop.repository.Users.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class QnaService {

    private final QnaRepository QnaRepo;
    private final UserRepository UserRepo;

    public QnaService (QnaRepository qnaRepo, UserRepository userRepo) {
        this.QnaRepo = qnaRepo;
        this.UserRepo = userRepo;
    }

    //사용자가 작성한 QnaList를 반환
    public List<QnaListDTO> getMyQnas (String userId) {
        List<Qna> qnaList = QnaRepo.findByUserUserId(userId);
        List<QnaListDTO> qnaListDTOList = new ArrayList<>();
        for(Qna qna : qnaList) {
            qnaListDTOList.add(new QnaListDTO(qna));
        }
        return qnaListDTOList;
    }

    //모든 QnaList를 반환
    public List<QnaListDTO> getAllQnas () {
        List<Qna> qnaList = QnaRepo.findAll();
        List<QnaListDTO> qnaListDTOList = new ArrayList<>();
        for(Qna qna : qnaList) {
            qnaListDTOList.add(new QnaListDTO(qna));
        }
        return qnaListDTOList;
    }

    public List<QnaListDTO> getQnasByUser (String nickname) {
        List<Qna> qnaList = QnaRepo.findByUserNickNameContaining(nickname);
        List<QnaListDTO> qnaListDTOList = new ArrayList<>();
        for(Qna qna : qnaList) {
            qnaListDTOList.add(new QnaListDTO(qna));
        }
        return qnaListDTOList;
    }

    public List<QnaListDTO> getQnasByTitle (String title) {
        List<Qna> qnaList = QnaRepo.findByQuestionTitleContaining(title);
        List<QnaListDTO> qnaListDTOList = new ArrayList<>();
        for(Qna qna : qnaList) {
            qnaListDTOList.add(new QnaListDTO(qna));
        }
        return qnaListDTOList;
    }

    public QnaDTO getQnaDetail (Long qnaId) {
        Qna qna = QnaRepo.findById(qnaId)
            .orElseThrow(() -> new EntityNotFoundException("QnA가 존재하지 않습니다."));
        return new QnaDTO(qna);
    }

    public void postQna (QnaPostDTO qnaPostDTO,String userId) {
        Qna qna = new Qna();
        User user = UserRepo.findByUserId(userId)
            .orElseThrow(() -> new EntityNotFoundException("사용자가 존재하지 않습니다."));
        qna.setUser(user);
        qna.setQuestionTitle(qnaPostDTO.getQuestionTitle());
        qna.setContent(qnaPostDTO.getContent());
        qna.setQuestionedAt(LocalDateTime.now());
        QnaRepo.save(qna);
    }

    public void putQna (Long qnaId, QnaPostDTO qnaPostDTO, String userId) {
        Qna qna = QnaRepo.findById(qnaId)
            .orElseThrow(() -> new EntityNotFoundException("QnA가 존재하지 않습니다."));
        if(!qna.getUser().getUserId().equals(userId)) //작성자가 맞는지 확인
            throw new AccessDeniedException("본인이 작성한 QnA만 수정할 수 있습니다.");
        qna.setQuestionTitle(qnaPostDTO.getQuestionTitle());
        qna.setContent(qnaPostDTO.getContent());
        QnaRepo.save(qna);
    }

    public void putQnaAnswer (Long qnaId, String answer, String userId) {
        Qna qna = QnaRepo.findById(qnaId)
            .orElseThrow(() -> new EntityNotFoundException("QnA가 존재하지 않습니다."));
        User user = UserRepo.findByUserId(userId)
            .orElseThrow(() -> new EntityNotFoundException("사용자가 존재하지 않습니다."));
        if (!user.getRole().equals("ADMIN"))
            throw new AccessDeniedException("관리자만 QnA 답변 작성이 가능합니다.");
        qna.setAnswer(answer);
        qna.setAnsweredAt(LocalDateTime.now());
        QnaRepo.save(qna);
    }

    public  void deleteQna (Long qnaId, String userId) {
        Qna qna = QnaRepo.findById(qnaId)
            .orElseThrow(() -> new EntityNotFoundException("QnA가 존재하지 않습니다."));
        if(!qna.getUser().getUserId().equals(userId))
            throw new AccessDeniedException("본인이 작성한 QnA만 삭제할 수 있습니다.");
        QnaRepo.delete(qna);
    }

}
