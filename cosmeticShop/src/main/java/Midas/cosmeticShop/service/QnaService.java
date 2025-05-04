package Midas.cosmeticShop.service;

import Midas.cosmeticShop.dto.QnaDTO;
import Midas.cosmeticShop.dto.QnaListDTO;
import Midas.cosmeticShop.entity.Qna;
import Midas.cosmeticShop.entity.Users.User;
import Midas.cosmeticShop.repository.QnaRepository;
import Midas.cosmeticShop.repository.Users.UserRepository;
import org.springframework.security.core.Authentication;
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
    public List<QnaListDTO> getQnaList (String userId) {
        List<Qna> qnaList = QnaRepo.findByUserId(userId);
        List<QnaListDTO> qnaListDTOList = new ArrayList<>();
        for(Qna qna : qnaList) {
            qnaListDTOList.add(new QnaListDTO(qna));
        }
        return qnaListDTOList;
    }

    //모든 QnaList를 반환
    public List<QnaListDTO> getAllQnaList () {
        List<Qna> qnaList = QnaRepo.findAll();
        List<QnaListDTO> qnaListDTOList = new ArrayList<>();
        for(Qna qna : qnaList) {
            qnaListDTOList.add(new QnaListDTO(qna));
        }
        return qnaListDTOList;
    }

    public QnaDTO getQnaDetail (Long qnaId) {
        Qna qna = QnaRepo.findById(qnaId)
                .orElseThrow();
        return new QnaDTO(qna);
    }

    public void postQna (String questionTitle, String content,String userId) {
        Qna qna = new Qna();
        User user = UserRepo.findByUserId(userId)
                        .orElseThrow();
        qna.setUser(user);
        qna.setQuestionTitle(questionTitle);
        qna.setContent(content);
        qna.setQuestionedAt(LocalDateTime.now());
        QnaRepo.save(qna);
    }

    public void putQna (Long qnaId, String questionTitle, String content) {
        Qna qna = QnaRepo.findById(qnaId)
                .orElseThrow();
        qna.setQuestionTitle(questionTitle);
        qna.setContent(content);
        QnaRepo.save(qna);
    }

    public void putQnaAnswer (Long qnaId, String answer) {
        Qna qna = QnaRepo.findById(qnaId)
                .orElseThrow();
        qna.setAnswer(answer);
        qna.setAnsweredAt(LocalDateTime.now());
        QnaRepo.save(qna);
    }

    public  void deleteQna (Long qnaId) {
        Qna qna = QnaRepo.findById(qnaId)
                .orElseThrow();
        QnaRepo.deleteById(qnaId);
    }

}
