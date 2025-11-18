package Midas.cosmeticshop.dto;

import Midas.cosmeticshop.entity.CompanyQna;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CompanyQnaListDTO {
    private Long id;
    private String companyName;
    private String questionTitle;
    private LocalDateTime questionedAt;
    private boolean answered;
    @JsonProperty("isAnswered")
    private boolean isAnswered; // 프론트엔드 호환성을 위한 필드

    public CompanyQnaListDTO(CompanyQna companyQna) {
        this.id = companyQna.getId();
        this.companyName = companyQna.getCompany().getCompanyName();
        this.questionTitle = companyQna.getQuestionTitle();
        this.questionedAt = companyQna.getQuestionedAt();
        this.answered = companyQna.getAnswer() != null;
        this.isAnswered = companyQna.getAnswer() != null; // answered와 동일한 값
    }
}

