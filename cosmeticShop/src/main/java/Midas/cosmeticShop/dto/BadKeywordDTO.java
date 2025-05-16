package Midas.cosmeticshop.dto;

import Midas.cosmeticshop.entity.BadKeyword;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class BadKeywordDTO {

    private Long id;
    private String keyword;

    public BadKeywordDTO(BadKeyword badKeyword) {
        this.id = badKeyword.getId();
        this.keyword = badKeyword.getKeyword();
    }
}
