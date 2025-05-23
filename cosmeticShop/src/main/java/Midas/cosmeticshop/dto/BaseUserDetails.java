package Midas.cosmeticshop.dto;

import Midas.cosmeticshop.entity.user.BaseUser;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

public class BaseUserDetails implements UserDetails {

    private final BaseUser user;

    public BaseUserDetails(BaseUser user) { this.user = user; }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + user.getRole()));  // ex) ROLE_USER, ROLE_COMPANY
    }

    @Override
    public String getUsername() { return user.getUserId(); }

    @Override
    public String getPassword() { return user.getPassword(); }

    // 계정 만료·잠김·패스워드 만료 여부 : 필요하면 BaseUser에 필드 추가
    @Override
    public boolean isAccountNonExpired() { return true; }

    // 도메인 객체 그대로 꺼내 쓰고 싶을 때
    public BaseUser getDomain() {
        return user;
    }

}

