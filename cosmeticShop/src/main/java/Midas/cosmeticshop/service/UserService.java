package Midas.cosmeticshop.service;

import Midas.cosmeticshop.dto.BaseUserDetails;
import Midas.cosmeticshop.dto.UserInfo.NicknameChangeDTO;
import Midas.cosmeticshop.dto.UserInfo.UserProfileDTO;
import Midas.cosmeticshop.entity.user.User;
import Midas.cosmeticshop.repository.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.hibernate.ResourceClosedException;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;

    private final Map<String, String> codeStore = new ConcurrentHashMap<>();
    private final Map<String, Long> codeExpire = new ConcurrentHashMap<>();

    public UserProfileDTO getUserProfile(BaseUserDetails userDetails) {
        // 사용자 정보를 DB에서 가져와서 DTO로 변환
        // 예시 코드:
        User user = userRepository.findByUserId(userDetails.getUsername())
            .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

        return UserProfileDTO.builder()
            .id(user.getId())
            .userId(user.getUserId())
            .nickname(user.getNickName())
            .email(user.getEmailAddress())
            .role(user.getRole())
            .build();
    }

    public boolean existsByUserIdAndEmail(String userId, String email) {
        return userRepository.existsByUserIdAndEmailAddress(userId, email);
    }

    public void sendVerificationCode(String userId, String email) {
        String code = String.valueOf((int)(Math.random() * 900000) + 100000);
        codeStore.put(userId, code);
        codeExpire.put(userId, System.currentTimeMillis() + 3 * 60 * 1000);
        emailService.send(email, "비밀번호 찾기 인증번호", "인증번호: " + code);
    }

    public boolean verifyCode(String userId, String code) {
        String stored = codeStore.get(userId);
        Long expire = codeExpire.get(userId);
        if (stored == null || expire == null) return false;
        if (System.currentTimeMillis() > expire) return false;
        return stored.equals(code);
    }

    public void changePassword(String userId, String newPassword) {
        User user = userRepository.findByUserId(userId).orElseThrow();
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        codeStore.remove(userId);
        codeExpire.remove(userId);
    }


    @Transactional
    public ResponseEntity<Void> changeNickName(BaseUserDetails baseUserDetails,
                                               NicknameChangeDTO nicknameChangeDTO) {
        // 변경하고 싶은 닉네임을 가진 사용자가 이미 존재하는지 검사
        String nickNameToChange = nicknameChangeDTO.getNickNameToChange();
        Boolean isExist = userRepository.existsByNickName(nickNameToChange);

        if(!isExist) { // 변경 가능
            User existUser = userRepository.findByUserId(baseUserDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다 !!!"));
            existUser.setNickName(nickNameToChange);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.badRequest().build();
    }
}