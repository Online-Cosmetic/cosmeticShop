package Midas.cosmeticShop.entity;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "admin")
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class Admin {

    /*
        DDL 에서
        id INT PRIMARY KEY CHECK (id = 987654321) 로 설정
    */
    @Id @Column(name = "id", nullable = false)
    private final Long id = 987654321L;


    @Column(name = "admin_id", unique = true, nullable = false)
    private String adminId;

    @Column(nullable = false)
    private String password;


}