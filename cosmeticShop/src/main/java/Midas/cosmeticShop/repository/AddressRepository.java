package Midas.cosmeticshop.repository;

import Midas.cosmeticshop.entity.Address;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AddressRepository extends JpaRepository<Address, Long> {
    List<Address> findByUserId(Long userId);

    Optional<Address> findByIdAndUserUserId(Long addressId, String userId);

    void deleteByIdAndUserUserId(Long addressId, String userId);
}
