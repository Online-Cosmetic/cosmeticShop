package Midas.cosmeticShop.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@ResponseBody
public class MainController {

    @GetMapping("/home")
    public String mainP() {
        /*
            JWT 는 STATELESS 하게 관리되기는 하지만,
            JWT 를 통해 일시적인 요청에 대해서는 세션을 잠시동안 생성하기 때문에,
            내부 SecurityContextHolder 에서 사용자 정보를 꺼낼 수 있다.
        */
        return "Main Controller";
    }
}
