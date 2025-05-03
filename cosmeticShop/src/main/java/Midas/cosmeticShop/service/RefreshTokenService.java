package Midas.cosmeticShop.service;

import Midas.cosmeticShop.entity.RefreshToken;
import Midas.cosmeticShop.entity.Users.BaseUser;
import Midas.cosmeticShop.exception.TokenRefreshException;
import Midas.cosmeticShop.repository.Users.BaseUserRepository;
import Midas.cosmeticShop.repository.RefreshTokenRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

@Service
public class RefreshTokenService {

    @Value("${spring.jwt.refreshExpirationMs}")
    private Long refreshTokenDurationMs;

    private final RefreshTokenRepository refreshTokenRepository;
    private final BaseUserRepository baseUserRepository;
//    private final UserRepository userRepository;
//    private final CompanyRepository companyRepository;
//    private final AdminRepository adminRepository;

//    public RefreshTokenService(RefreshTokenRepository refreshTokenRepository, UserRepository userRepo, CompanyRepository companyRepository, AdminRepository adminRepository) {
//        this.refreshTokenRepository = refreshTokenRepository;
//        this.userRepository = userRepo;
//        this.companyRepository = companyRepository;
//        this.adminRepository = adminRepository;
//    }

    public RefreshTokenService(RefreshTokenRepository refreshTokenRepository, BaseUserRepository baseUserRepository) {
        this.refreshTokenRepository = refreshTokenRepository;
        this.baseUserRepository = baseUserRepository;
    }

    // 새로 추가: refresh token을 조회하는 메소드
    public Optional<RefreshToken> findByToken(String token) {
        return refreshTokenRepository.findByToken(token);
    }

    /* 리프레시 토큰을 만들때 일반/기업 회원 모두 만들 수 있도록 수정하자 */
    @Transactional
    public RefreshToken createRefreshToken(String userId) {
//    public RefreshToken createRefreshToken(String userId, String role) {
//        role = role.startsWith("ROLE_") ? role.substring(5) : role;
        Optional<BaseUser> userOpt = baseUserRepository.findByUserId(userId);
        if (userOpt.isEmpty()) {
            throw new TokenRefreshException(userId, "해당 권한의 사용자를 찾을 수 없습니다.");
        }

        BaseUser user = userOpt.get();
        // 기존 refresh token 제거 (트랜잭션 내에서 실행)
        refreshTokenRepository.deleteByUser(user);

        RefreshToken token = new RefreshToken();
        token.setUser(user);
        token.setExpiryDate(Instant.now().plusMillis(refreshTokenDurationMs));
        token.setToken(UUID.randomUUID().toString());
        return refreshTokenRepository.save(token);
    }

//    private void deleteRefreshToken(String role, Optional<BaseUser> user) {
//        if ("ROLE_USER".equals(role)) {
//            refreshTokenRepository.deleteByUser((User) user.get());
//        } else if ("ROLE_COMPANY".equals(role)) {
//            refreshTokenRepository.deleteByUser((Company) user.get());
//        } else {
//            refreshTokenRepository.deleteByUser((Admin) user.get());
//        }
//    }

//    private Optional<BaseUser> getUserByRole(String userId, String role) {
//        if ("ROLE_USER".equals(role)) {
//            Optional<User> user1 = userRepository.findByUserId(userId);
//            if (user1.isPresent()) {
//                return Optional.of(user1.get());
//            }
//        } else if ("ROLE_COMPANY".equals(role)) {
//            Optional<Company> company = companyRepository.findByUserId(userId);
//            if (company.isPresent()) {
//                return Optional.of(company.get());
//            }
//        } else if ("ROLE_ADMIN".equals(role)) {
//            Optional<Admin> admin = adminRepository.findByUserId(userId);
//            if (admin.isPresent()) {
//                return Optional.of(admin.get());
//            }
//        }
//        return Optional.empty();
//    }

//    private Optional<BaseUser> getUserByRole(String userId, String role) {
//        // "ROLE_USER" 같이 접두사가 붙어있으면 제거
//        String rawRole = role.startsWith("ROLE_") ? role.substring(5) : role;
//
//        if ("USER".equals(role)) {
//            return baseUserRepository.findByUserId(userId);
//        } else if ("COMPANY".equals(role)) {
//            return baseUserRepository.findByUserId(userId);
//        } else if ("ADMIN".equals(role)) {
//            return baseUserRepository.findByUserId(userId);
//        }
//        return Optional.empty();
//    }

    public RefreshToken verifyExpiration(RefreshToken token) {
        if (token.getExpiryDate().isBefore(Instant.now())) {
            refreshTokenRepository.delete(token);
            throw new TokenRefreshException(token.getToken(), "만료된 RefreshToken입니다.");
        }
        return token;
    }


    /** 로그아웃 시 하나의 리프레시 토큰만 폐기 */
    @Transactional
    public void invalidate(String token) {
        refreshTokenRepository.findByToken(token).ifPresent(refreshTokenRepository::delete);
    }

    /** (선택) 유저의 모든 리프레시 토큰 폐기 – 강제 로그아웃 */
    @Transactional
    public void invalidateAllByUserId(Long userId) {
        refreshTokenRepository.deleteAllByUserId(userId);
    }

}
