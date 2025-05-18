package Midas.cosmeticshop.service;

import Midas.cosmeticshop.dto.BaseUserDetails;
import Midas.cosmeticshop.dto.UserInfo.NicknameChangeDTO;
import Midas.cosmeticshop.entity.user.User;
import Midas.cosmeticshop.repository.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserInfoService {

    private final UserRepository userRepository;

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
