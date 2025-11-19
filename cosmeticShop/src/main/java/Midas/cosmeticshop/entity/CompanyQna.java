package Midas.cosmeticshop.entity;

import Midas.cosmeticshop.entity.user.Company;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "company_qna")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CompanyQna { /* 기업 회원용 QNA */

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;

    @Column(name = "question_title", nullable = false)
    private String questionTitle;

    /* 질문의 내용 */
    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @Column(columnDefinition = "TEXT")
    private String answer;

    @Column(name = "questioned_at", updatable = false)
    private LocalDateTime questionedAt;

    @Column(name = "answered_at")
    private LocalDateTime answeredAt;
}

