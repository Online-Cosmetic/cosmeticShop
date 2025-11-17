package Midas.cosmeticshop.dto;

import Midas.cosmeticshop.entity.CompanyQna;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CompanyQnaDetailDTO {
    private Long id;
    private String companyName;
    private String questionTitle;
    private String content;
    private String answer;
    private LocalDateTime questionedAt;
    private LocalDateTime answeredAt;
    private boolean answered;

    public CompanyQnaDetailDTO(CompanyQna companyQna) {
        this.id = companyQna.getId();
        this.companyName = companyQna.getCompany().getCompanyName();
        this.questionTitle = companyQna.getQuestionTitle();
        this.content = companyQna.getContent();
        this.answer = companyQna.getAnswer();
        this.questionedAt = companyQna.getQuestionedAt();
        this.answeredAt = companyQna.getAnsweredAt();
        this.answered = companyQna.getAnswer() != null;
    }
}

