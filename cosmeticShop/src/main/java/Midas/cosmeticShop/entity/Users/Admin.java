package Midas.cosmeticShop.entity.Users;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "admin")
@Getter @Setter
@AllArgsConstructor
public class Admin extends BaseUser {
}