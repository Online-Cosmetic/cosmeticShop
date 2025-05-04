package Midas.cosmeticShop.entity;

import Midas.cosmeticShop.entity.Users.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "qna")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Qna { /* 쇼핑몰 전반에 대한 QNA */

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "question_title", nullable = false)
    private String questionTitle;

    /* 질문의 내용 */
    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @Column(columnDefinition = "TEXT")
    private String answer;

    @Column(name = "questioned_at", updatable = false)
    private LocalDateTime questionedAt;

    @Column(name = "answered_at", updatable = false)
    private LocalDateTime answeredAt;
}
