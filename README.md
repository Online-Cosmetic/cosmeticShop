

# CosMall 🛍️  
## 화장품 쇼핑몰 웹 서비스

- CosMall은 일반 사용자·기업·관리자 3가지 유형을 중심으로 한 화장품 전문 쇼핑몰 웹 서비스입니다.  
- 회원가입/로그인부터 상품 조회·장바구니·주문/결제·리뷰·QnA·찜, 기업 대시보드, 관리자 페이지까지, 실제 서비스 운영 흐름을 한 번에 경험할 수 있도록 설계했습니다.

---

## 1. 시스템 아키텍처

<img width="1597" height="903" alt="Cosmall-아키텍처 drawio" src="https://github.com/user-attachments/assets/c31e922b-4827-4587-aa0e-009e81aa45e3" />

---

## 2. 주요 기능

### 👤 공통/회원 기능
- 이메일 회원가입 및 로그인 (JWT 기반 인증/인가)
- 마이페이지
  - 기본 정보 수정
  - 비밀번호 변경 (이메일 인증)
  - 주문 내역·배송지 관리
- 최근 본 상품, 찜한 상품 관리
- 쿠폰 수령 및 주문 시 적용

### 🛒 쇼핑 기능
- 상품 목록 / 상세 조회
  - 카테고리별 필터, 정렬(인기순 등)  
  - 고해상도 상품 이미지, 상세 설명, 리뷰, 연관 상품
- 장바구니
  - 수량 조절, 선택 삭제, 총 결제 금액 자동 계산
- 주문 & 결제
  - 배송지 등록/선택
  - 외부 결제 PG 연동
    - KG이니시스
    - Toss Payments
    - KakaoPay

### ⭐ 리뷰 · QnA · 찜
- 별점 + 사진 첨부 리뷰 작성/수정/삭제
- 리뷰 추천(Like) 및 추천순/최신순 정렬
- 상품별 QnA 작성·수정·검색·조회
- 상품 찜 및 찜 목록 관리

### 🏢 기업(셀러) 기능
- 상품 등록/수정/삭제
- 주문 상태(배송 상태 등) 변경
- 기업 통계 대시보드
  - 기간별 매출/판매량
  - 인기 상품 Top 리스트
  - 거래 내역 조회

### 🛠 관리자 기능
- 회원/기업/상품 관리
- 악성 리뷰 및 QnA 모니터링·삭제
- 기업 회원 가입 신청 승인 프로세스
- 쿠폰 발급 및 운영
- 통계/모니터링 화면

---

### 🔗 전체 흐름 요약

1. **개발 환경**
   - IntelliJ IDEA에서 로컬 개발
   - GitHub으로 소스 코드 관리 (branch 전략 기반 협업)

2. **CI/CD 파이프라인**
   - GitHub에 `push`  
   - GitHub Actions가 자동으로 빌드 & 테스트 수행
   - 성공 시 AWS EC2로 배포 (Docker 이미지 업데이트 및 컨테이너 재기동)

3. **런타임 인프라**
   - **AWS EC2**
     - Docker 컨테이너 안에서 Spring Boot 애플리케이션 실행
     - Nginx를 Reverse Proxy로 사용하여 정적 리소스 및 API 라우팅
   - **AWS S3**
     - 상품/프로필 등 이미지 정적 파일 Storage
   - **Neon (PostgreSQL)**
     - 서비스 데이터 RDBMS
   - **외부 결제 PG**
     - KG이니시스 / Toss Payments / KakaoPay 등 결제 처리

4. **클라이언트**
   - React + TailwindCSS 기반 SPA  
   - 브라우저에서 Nginx → Spring Boot REST API와 통신

---

## 3. 기술 스택

### 🌐 Frontend
- React
- Vite
- TailwindCSS
- Axios

### 🧩 Backend
- Java 17+
- Spring Boot
- Spring Security + JWT
- Spring Data JPA
- PostgreSQL (Neon)
- 외부 결제 API(Iamport, KG이니시스, Toss, KakaoPay 등 연동 구조)

### ☁ Infra & DevOps
- AWS EC2
- AWS S3
- Docker
- Nginx
- GitHub Actions (CI/CD)
- GitHub (형상 관리)

### 🤝 Collaboration
- Jira (스프린트/이슈 관리)
- Figma (UI 디자인)
- Notion (자료 공유 및 문서 대시보드)
