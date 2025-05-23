package Midas.cosmeticshop.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ReviewPostDTO {
    private Long productId;
    private String content;
    private int rating;
    private List<String> imageUrls;
}
