package Midas.cosmeticShop.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table (name = "bad_keywords")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class BadKeyword {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column
    private String keyword;

}
