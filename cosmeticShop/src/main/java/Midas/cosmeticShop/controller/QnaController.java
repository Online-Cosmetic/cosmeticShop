package Midas.cosmeticShop.controller;

import Midas.cosmeticShop.dto.QnaDTO;
import Midas.cosmeticShop.dto.QnaListDTO;
import Midas.cosmeticShop.dto.QnaPostDTO;
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
@RequestMapping("/qnas")
public class QnaController {

    private final QnaService qnaService;

    public QnaController (QnaService qnaService) {
        this.qnaService = qnaService;
    }

    //사용자가 작성한 Qna 목록 반환
    @GetMapping("/me")
    public ResponseEntity<List<QnaListDTO>> getMyQnas(Authentication authentication) {
        return ResponseEntity.ok().body(qnaService.getMyQnas(authentication.getName()));
    }

    //모든 Qna 목록 반환
    @GetMapping("/all")
    public ResponseEntity<List<QnaListDTO>> getAllQnas() {
        return ResponseEntity.ok().body(qnaService.getAllQnas());
    }

    @GetMapping("/search/user")
    public ResponseEntity<List<QnaListDTO>> getQnasByUser(@RequestParam("nickname") String nickname) {
        return ResponseEntity.ok().body(qnaService.getQnasByUser(nickname));
    }


    @GetMapping("/search/title")
    public ResponseEntity<List<QnaListDTO>> getQnasByTitle(@RequestParam("title") String title) {
        return ResponseEntity.ok().body(qnaService.getQnasByTitle(title));
    }


    //Qna 상세 정보 반환 (상세페이지용)
    @GetMapping("detail/{qnaId}")
    public ResponseEntity<QnaDTO> getQnaDetail(@PathVariable Long id) {
        return ResponseEntity.ok().body(qnaService.getQnaDetail(id));
    }

    //Qna 작성(추가)
    @PostMapping
    public ResponseEntity<Void> postQna(@RequestBody QnaPostDTO qnaPostDTO,
                                        Authentication authentication) {
        qnaService.postQna(qnaPostDTO, authentication.getName());
        return ResponseEntity.ok().build();
    }

    //Qna 제목/내용 수정
    @PutMapping("/{qnaId}")
    public ResponseEntity<Void> putQna(@PathVariable Long id,
                                       @RequestBody QnaPostDTO qnaPostDTO,
                                       Authentication authentication) {
        qnaService.putQna(id, qnaPostDTO, authentication.getName());
        return ResponseEntity.ok().build();
    }

    //Qna 답변 작성
    @PutMapping("/{qnaId}/answers")
    public ResponseEntity<Void> putQnaAnswer(@PathVariable Long id,
                                             @RequestParam("answer") String answer,
                                             Authentication authentication) {
        qnaService.putQnaAnswer(id, answer, authentication.getName());
        return ResponseEntity.ok().build();
    }

    //Qna 삭제
    @DeleteMapping("/{qnaId}")
    public  ResponseEntity<Void> deleteQna(@PathVariable Long id, Authentication authentication) {
        qnaService.deleteQna(id, authentication.getName());
        return ResponseEntity.ok().build();
    }

}
