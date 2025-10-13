package Midas.cosmeticshop.entity.user;


import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "admins")
@Getter @Setter
@NoArgsConstructor
@SuperBuilder
public class Admin extends BaseUser {
}