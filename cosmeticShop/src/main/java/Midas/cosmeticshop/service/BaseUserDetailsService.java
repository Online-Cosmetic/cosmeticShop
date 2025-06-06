package Midas.cosmeticshop.service;

import Midas.cosmeticshop.dto.BaseUserDetails;
import Midas.cosmeticshop.entity.user.BaseUser;
import Midas.cosmeticshop.repository.user.BaseUserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class BaseUserDetailsService implements UserDetailsService {
    private final BaseUserRepository repo;

    public BaseUserDetailsService(BaseUserRepository repo) {
        this.repo = repo;
    }


    // 리턴타입 UserDetails -> BaseUserDetails 로 변경함
    @Override
    public BaseUserDetails loadUserByUsername(String userId)
        throws UsernameNotFoundException {

        BaseUser baseUser = repo.findByUserId(userId)
            .orElseThrow(() -> {
                log.error("User not found: " + userId);
                return new UsernameNotFoundException("사용자를 찾을 수 없습니다: " + userId);
            });

        return new BaseUserDetails(baseUser);
    }
}
