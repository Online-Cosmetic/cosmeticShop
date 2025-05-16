package Midas.cosmeticshop.service;

import Midas.cosmeticshop.dto.signup.CompanySignUpDTO;
import Midas.cosmeticshop.dto.signup.UserSignUpDTO;
import Midas.cosmeticshop.entity.user.Company;
import Midas.cosmeticshop.entity.user.User;
import Midas.cosmeticshop.repository.user.CompanyRepository;
import Midas.cosmeticshop.repository.user.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;


@Service
public class JoinService {

    private final UserRepository userRepository ;
    private final CompanyRepository companyRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder; /* PW 암호화를 위한 인코더 */

    public JoinService(UserRepository userRepository, CompanyRepository companyRepository, BCryptPasswordEncoder bCryptPasswordEncoder) {
        this.userRepository = userRepository;
        this.companyRepository = companyRepository;
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
    }

    /* 일반 회원 가입 */
    public void joinUser(UserSignUpDTO dto) {
        /* 이미 가입된 일반회원 체크 */
        validateUserSignUpinfo(dto);
        User user = User.from(dto, bCryptPasswordEncoder);
        userRepository.save(user);
    }

    /* 기업 회원 가입 */
    public void joinCompany(CompanySignUpDTO dto) {
        /* 이미 가입된 기업회원 체크 */
        validateCompanySignUpinfo(dto);
        Company company = Company.create(dto, bCryptPasswordEncoder);
        companyRepository.save(company);
    }

    /* 일반 회원 가입 시 정보 검증 */
    private void validateUserSignUpinfo(UserSignUpDTO dto) {
        Boolean idExist = userRepository.existsByUserId(dto.getUserId());
        Boolean nickNameExist = userRepository.existsByNickName(dto.getNickName());
        /* 일반/기업회원 이메일 모두 체크 */
        Boolean emailExist =
            userRepository.existsByEmailAddress(dto.getEmail()) || companyRepository.existsByEmailAddress(dto.getEmail());

        if (idExist) {
            throw new IllegalStateException("이미 사용 중인 아이디 입니다!");
        } else if (nickNameExist) {
            throw new IllegalStateException("이미 사용 중인 닉네임 입니다!");
        } else if (emailExist) {
            throw new IllegalStateException("이미 사용 중인 이메일 입니다!");
        }
    }

    /* 기업 회원 가입 시 정보 검증 */
    private void validateCompanySignUpinfo(CompanySignUpDTO dto) {
        Boolean idExist = companyRepository.existsByCompanyName(dto.getCompanyName());
        /* 일반/기업회원 이메일 모두 체크 */
        Boolean emailExist =
            companyRepository.existsByEmailAddress(dto.getEmail()) || userRepository.existsByEmailAddress(dto.getEmail());
        Boolean phoneNumber = companyRepository.existsByPhoneNumber(dto.getPhoneNumber());

        if(idExist) {
            throw new IllegalStateException("이미 사용 중인 아이디 입니다!");
        } else if(emailExist) {
            throw new IllegalStateException("이미 사용 중인 이메일 입니다!");
        } else if(phoneNumber) {
            throw new IllegalStateException("이미 사용 중인 전화번호 입니다!");
        }
    }
}
