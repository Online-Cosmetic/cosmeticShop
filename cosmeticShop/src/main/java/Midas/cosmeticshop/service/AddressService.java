package Midas.cosmeticshop.service;

import Midas.cosmeticshop.dto.AddressDTO;
import Midas.cosmeticshop.dto.BaseUserDetails;
import Midas.cosmeticshop.entity.Address;
import Midas.cosmeticshop.entity.user.User;
import Midas.cosmeticshop.repository.AddressRepository;
import Midas.cosmeticshop.repository.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AddressService {
    private final AddressRepository addressRepository;
    private final UserRepository userRepository;

    @Transactional
    public AddressDTO addAddress(BaseUserDetails baseUserDetails, AddressDTO dto) {

        String userId = baseUserDetails.getUsername();
        User user = userRepository.findByUserId(userId)
            .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        Address address = Address.builder()
            .city(dto.getCity())
            .street(dto.getStreet())
            .detail(dto.getDetail())
            .build();

        // 양방향 관계 설정
        user.addAddress(address);

        Address savedAddress = addressRepository.save(address);
        return convertToDto(savedAddress);
    }

    @Transactional(readOnly = true)
    public List<AddressDTO> getAllAddresses(BaseUserDetails baseUserDetails) {

        String userId = baseUserDetails.getUsername();
        User user = userRepository.findByUserId(userId)
            .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        // addresses는 지연 로딩되어 이 시점에 실제 데이터를 가져옴
        return user.getAddresses().stream()
            .map(this::convertToDto)
            .collect(Collectors.toList());
    }

    @Transactional
    public AddressDTO updateAddress(BaseUserDetails baseUserDetails, Long addressId, AddressDTO dto) {

        String userId = baseUserDetails.getUsername();

        Address address = addressRepository.findByIdAndUserUserId(addressId, userId)
            .orElseThrow(() -> new IllegalArgumentException("주소를 찾을 수 없습니다."));

        address.updateAddress(dto.getCity(), dto.getStreet(), dto.getDetail());
        return convertToDto(address);
    }

    @Transactional
    public void deleteAddress(BaseUserDetails baseUserDetails, Long addressId) {
        String userId = baseUserDetails.getUsername();
        addressRepository.deleteByIdAndUserUserId(addressId, userId);
    }

    private AddressDTO convertToDto(Address address) {
        AddressDTO dto = new AddressDTO();
        dto.setId(address.getId());
        dto.setCity(address.getCity());
        dto.setStreet(address.getStreet());
        dto.setDetail(address.getDetail());
        return dto;
    }
}