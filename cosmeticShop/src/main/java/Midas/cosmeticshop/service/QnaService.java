package Midas.cosmeticshop.service;

import Midas.cosmeticshop.dto.QnaDTO;
import Midas.cosmeticshop.dto.QnaListDTO;
import Midas.cosmeticshop.dto.QnaPostDTO;
import Midas.cosmeticshop.entity.Qna;
import Midas.cosmeticshop.entity.user.Admin;
import Midas.cosmeticshop.entity.user.User;
import Midas.cosmeticshop.repository.QnaRepository;
import Midas.cosmeticshop.repository.user.AdminRepository;
import Midas.cosmeticshop.repository.user.UserRepository;
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
    private final AdminRepository AdminRepo;

    public QnaService(QnaRepository qnaRepo, UserRepository userRepo, AdminRepository adminRepo) {
        this.QnaRepo = qnaRepo;
        this.UserRepo = userRepo;
        this.AdminRepo = adminRepo;
    }

    // Get all answered QnAs
    public List<QnaListDTO> getAnsweredQnas() {
        List<Qna> qnaList = QnaRepo.findByAnswerIsNotNull();
        List<QnaListDTO> qnaListDTOList = new ArrayList<>();
        for(Qna qna : qnaList) {
            qnaListDTOList.add(new QnaListDTO(qna));
        }
        return qnaListDTOList;
    }

    // Get all unanswered QnAs
    public List<QnaListDTO> getUnansweredQnas() {
        List<Qna> qnaList = QnaRepo.findByAnswerIsNull();
        List<QnaListDTO> qnaListDTOList = new ArrayList<>();
        for(Qna qna : qnaList) {
            qnaListDTOList.add(new QnaListDTO(qna));
        }
        return qnaListDTOList;
    }

    // Get answered QnAs with title containing the given string
    public List<QnaListDTO> getAnsweredQnasByTitle(String title) {
        List<Qna> qnaList = QnaRepo.findByAnswerIsNotNullAndQuestionTitleContaining(title);
        List<QnaListDTO> qnaListDTOList = new ArrayList<>();
        for(Qna qna : qnaList) {
            qnaListDTOList.add(new QnaListDTO(qna));
        }
        return qnaListDTOList;
    }

    // Get unanswered QnAs with title containing the given string
    public List<QnaListDTO> getUnansweredQnasByTitle(String title) {
        List<Qna> qnaList = QnaRepo.findByAnswerIsNullAndQuestionTitleContaining(title);
        List<QnaListDTO> qnaListDTOList = new ArrayList<>();
        for(Qna qna : qnaList) {
            qnaListDTOList.add(new QnaListDTO(qna));
        }
        return qnaListDTOList;
    }

    // Admin delete QnA (no user check)
    public void adminDeleteQna(Long qnaId, String adminId) {
        Admin admin = AdminRepo.findByUserId(adminId)
            .orElseThrow(() -> new EntityNotFoundException("관리자가 존재하지 않습니다."));
        if (!admin.getRole().equals("ADMIN"))
            throw new AccessDeniedException("관리자만 QnA 삭제가 가능합니다.");

        Qna qna = QnaRepo.findById(qnaId)
            .orElseThrow(() -> new EntityNotFoundException("QnA가 존재하지 않습니다."));
        QnaRepo.delete(qna);
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

    public List<QnaListDTO> searchMyQnasByTitle(String title, String userId) {
        List<Qna> qnas = QnaRepo.findByQuestionTitleContainingAndUser_UserId(title, userId);
        return qnas.stream().map(QnaListDTO::new).toList();
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

    // 기존 메소드들은 그대로 유지...

    // QnA 답변 작성 메소드 수정
    public void putQnaAnswer(Long qnaId, String answer, String adminId) {
        // QnA 존재 확인
        Qna qna = QnaRepo.findById(qnaId)
            .orElseThrow(() -> new EntityNotFoundException("QnA가 존재하지 않습니다."));
        
        // 관리자 권한 확인 - Admin 객체 사용
        Admin admin = AdminRepo.findByUserId(adminId)
            .orElseThrow(() -> new EntityNotFoundException("관리자가 존재하지 않습니다."));
        
        if (!admin.getRole().equals("ADMIN"))
            throw new AccessDeniedException("관리자만 QnA 답변 작성이 가능합니다.");
        
        // 답변 저장
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