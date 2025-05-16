package Midas.cosmeticshop.dto;

import Midas.cosmeticshop.entity.Qna;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class QnaDTO {
    private Long id;
    private String nickname;
    private String questionTitle;
    private String content;
    private String answer;
    private LocalDateTime questionedAt;
    private LocalDateTime answeredAt;
    private boolean isAnswered;

    public QnaDTO(Qna qna) {
        this.id = qna.getId();
        this.nickname = qna.getUser().getNickName();
        this.questionTitle = qna.getQuestionTitle();
        this.content = qna.getContent();
        this.answer = qna.getAnswer();
        this.questionedAt = qna.getQuestionedAt();
        this.answeredAt = qna.getAnsweredAt();
        this.isAnswered = qna.getAnswer() != null;
    }
}
