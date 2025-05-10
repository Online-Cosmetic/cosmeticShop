package Midas.cosmeticShop.dto.Auth;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class LoginRequestDetails {
    String loginType;
    /*
        UsernamePasswordAuthenticationToken 에 Role 을 구별하는 로직을 추가하려면
        setDetails 에 Object 형태로 넣을 수 밖에 없기 때문에 loginType(role) 만 담을 클래스 추가
    */
}
