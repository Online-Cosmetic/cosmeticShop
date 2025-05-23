package Midas.cosmeticshop.entity.user;


import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "admins")
@Getter @Setter
@NoArgsConstructor
public class Admin extends BaseUser {
}