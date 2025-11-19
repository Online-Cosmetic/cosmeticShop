package Midas.cosmeticshop.service;

import Midas.cosmeticshop.dto.signup.CompanySignUpDTO;
import Midas.cosmeticshop.dto.signup.UserSignUpDTO;
import Midas.cosmeticshop.entity.user.Company;
import Midas.cosmeticshop.entity.user.User;
import Midas.cosmeticshop.repository.user.BaseUserRepository;
import Midas.cosmeticshop.repository.user.CompanyRepository;
import Midas.cosmeticshop.repository.user.UserRepository;
import Midas.cosmeticshop.service.FileStorageService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;


@Service
public class JoinService {

    private final BaseUserRepository baseUserRepository;
    private final UserRepository userRepository ;
    private final CompanyRepository companyRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder; /* PW 암호화를 위한 인코더 */
    private final FileStorageService fileStorageService;

    public JoinService(BaseUserRepository baseUserRepository, UserRepository userRepository, CompanyRepository companyRepository, BCryptPasswordEncoder bCryptPasswordEncoder, FileStorageService fileStorageService) {
        this.baseUserRepository = baseUserRepository;
        this.userRepository = userRepository;
        this.companyRepository = companyRepository;
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
        this.fileStorageService = fileStorageService;
    }

    /* 일반 회원 가입 */
    public void joinUser(UserSignUpDTO dto) {
        /* 이미 가입된 일반회원 체크 */
        validateUserSignUpinfo(dto);
        User user = User.from(dto, bCryptPasswordEncoder);
        userRepository.save(user);
    }

    /* 기업 회원 가입 */
    public void joinCompany(CompanySignUpDTO dto, MultipartFile businessLicense) {
        /* 이미 가입된 기업회원 체크 */
        validateCompanySignUpinfo(dto);
        
        // 사업자등록증 파일 검증
        if (businessLicense == null || businessLicense.isEmpty()) {
            throw new IllegalArgumentException("사업자등록증 파일을 업로드해주세요.");
        }
        
        // 파일 저장
        String businessLicensePath = fileStorageService.storeFile(businessLicense);
        
        // DTO에 파일 경로 설정
        dto.setBusinessLicensePath(businessLicensePath);
        
        Company company = Company.create(dto, bCryptPasswordEncoder);
        companyRepository.save(company);
    }

    /* 일반 회원 가입 시 정보 검증 */
    private void validateUserSignUpinfo(UserSignUpDTO dto) {
        Boolean idExist = baseUserRepository.existsByUserId(dto.getUserId());
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
        Boolean idExist = baseUserRepository.existsByUserId(dto.getUserId());
        Boolean companyNameExist = companyRepository.existsByCompanyName(dto.getCompanyName());
        /* 일반/기업회원 이메일 모두 체크 */
        Boolean emailExist =
            companyRepository.existsByEmailAddress(dto.getEmail()) || userRepository.existsByEmailAddress(dto.getEmail());
        Boolean phoneNumber = companyRepository.existsByPhoneNumber(dto.getPhoneNumber());
        Boolean businessRegistrationNumberExist = companyRepository.existsByBusinessRegistrationNumber(dto.getBusinessRegistrationNumber());

        if(idExist) {
            throw new IllegalStateException("이미 사용 중인 아이디 입니다!");
        } else if(companyNameExist) {
            throw new IllegalStateException("이미 사용 중인 회사명 입니다!");
        } else if(emailExist) {
            throw new IllegalStateException("이미 사용 중인 이메일 입니다!");
        } else if(phoneNumber) {
            throw new IllegalStateException("이미 사용 중인 전화번호 입니다!");
        } else if(businessRegistrationNumberExist) {
            throw new IllegalStateException("이미 등록된 사업자등록번호 입니다!");
        }
    }
}
