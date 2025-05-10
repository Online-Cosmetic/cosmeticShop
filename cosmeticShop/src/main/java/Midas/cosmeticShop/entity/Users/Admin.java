package Midas.cosmeticShop.entity.Users;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "admins")
@Getter @Setter
@NoArgsConstructor
public class Admin extends BaseUser {
}