package Midas.cosmeticShop.dto;

import Midas.cosmeticShop.entity.Qna;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class QnaListDTO {
    private Long id;
    private String nickname;
    private String questionTitle;
    private LocalDateTime questionedAt;
    private boolean isAnswered;

    public QnaListDTO(Qna qna) {
        this.id = qna.getId();
        this.nickname = qna.getUser().getNickName();
        this.questionTitle = qna.getQuestionTitle();
        this.questionedAt = qna.getQuestionedAt();
        this.isAnswered = qna.getAnswer() != null;
    }
}
