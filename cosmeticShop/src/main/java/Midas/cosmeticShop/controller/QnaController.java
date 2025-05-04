package Midas.cosmeticShop.controller;

import Midas.cosmeticShop.dto.QnaDTO;
import Midas.cosmeticShop.dto.QnaListDTO;
import Midas.cosmeticShop.service.QnaService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
public class QnaController {

    private final QnaService qnaService;

    public QnaController (QnaService qnaService) {
        this.qnaService = qnaService;
    }

    //사용자가 작성한 Qna 목록 반환
    @GetMapping("/qnas")
    public ResponseEntity<List<QnaListDTO>> getQna(Authentication authentication) {
        return ResponseEntity.ok().body(qnaService.getQnaList(authentication.getName()));
    }

    //모든 Qna 목록 반환
    @GetMapping("/allQnas")
    public ResponseEntity<List<QnaListDTO>> getQna() {
        return ResponseEntity.ok().body(qnaService.getAllQnaList());
    }

    //Qna 상세 정보 반환 (상세페이지용)
    @GetMapping("/qnaDetails/{qnaId}")
    public ResponseEntity<QnaDTO> getQnaDetail(@PathVariable Long id) {
        return ResponseEntity.ok().body(qnaService.getQnaDetail(id));
    }

    //Qna 작성(추가)
    @PostMapping("/qnas")
    public ResponseEntity<Void> postQna(@RequestParam("questionTitle") String questionTitle,
                                        @RequestParam("content") String content,
                                        Authentication authentication) {
        qnaService.postQna(questionTitle, content, authentication.getName());
        return ResponseEntity.ok().build();
    }

    //Qna 제목/내용 수정
    @PutMapping("/qnas/{qnaId}")
    public ResponseEntity<Void> putQna(@PathVariable Long id,
                                       @RequestParam("questionTitle") String questionTitle,
                                       @RequestParam("content") String content) {
        qnaService.putQna(id, questionTitle, content);
        return ResponseEntity.ok().build();
    }

    //Qna 답변 작성
    @PutMapping("/qnas/{qnaId}/answers")
    public ResponseEntity<Void> putQnaAnswer(@PathVariable Long id,
                                             @RequestParam("answer") String answer) {
        qnaService.putQnaAnswer(id, answer);
        return ResponseEntity.ok().build();
    }

    //Qna 삭제
    @DeleteMapping("/qnas/{qnaId}")
    public  ResponseEntity<Void> deleteQna(@PathVariable Long id) {
        qnaService.deleteQna(id);
        return ResponseEntity.ok().build();
    }

}
