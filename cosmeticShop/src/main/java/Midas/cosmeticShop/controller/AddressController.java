package Midas.cosmeticshop.controller;

import Midas.cosmeticshop.dto.AddressDTO;
import Midas.cosmeticshop.dto.BaseUserDetails;
import Midas.cosmeticshop.service.AddressService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/addresses")
public class AddressController {

    private final AddressService addressService;

    public AddressController(AddressService addressService) {
        this.addressService = addressService;
    }

    @PostMapping
    public ResponseEntity<AddressDTO> addAddress(
        @AuthenticationPrincipal BaseUserDetails userDetails,
        @RequestBody AddressDTO addressDto) {
        return ResponseEntity.ok(addressService.addAddress(userDetails, addressDto));
    }

    @GetMapping
    public ResponseEntity<List<AddressDTO>> getAllAddresses(
        @AuthenticationPrincipal BaseUserDetails userDetails) {
        return ResponseEntity.ok(addressService.getAllAddresses(userDetails));
    }

    @PutMapping("/{addressId}")
    public ResponseEntity<AddressDTO> updateAddress(
        @AuthenticationPrincipal BaseUserDetails userDetails,
        @PathVariable Long addressId,
        @RequestBody AddressDTO addressDto) {
        return ResponseEntity.ok(addressService.updateAddress(userDetails, addressId, addressDto));
    }

    @DeleteMapping("/{addressId}")
    public ResponseEntity<Void> deleteAddress(
        @AuthenticationPrincipal BaseUserDetails userDetails,
        @PathVariable Long addressId) {
        addressService.deleteAddress(userDetails, addressId);
        return ResponseEntity.ok().build();
    }
}
