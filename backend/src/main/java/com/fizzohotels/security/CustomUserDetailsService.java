package com.fizzohotels.security;

import com.fizzohotels.entity.Admin;
import com.fizzohotels.entity.GuestUser;
import com.fizzohotels.repository.AdminRepository;
import com.fizzohotels.repository.GuestUserRepository;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final AdminRepository adminRepository;
    private final GuestUserRepository guestUserRepository;

    public CustomUserDetailsService(AdminRepository adminRepository,
                                     GuestUserRepository guestUserRepository) {
        this.adminRepository = adminRepository;
        this.guestUserRepository = guestUserRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Admin admin = adminRepository.findByUsername(username).orElse(null);
        if (admin != null) {
            return new User(
                    admin.getUsername(),
                    admin.getPassword(),
                    List.of(new SimpleGrantedAuthority("ROLE_" + admin.getRole()))
            );
        }

        GuestUser guestUser = guestUserRepository.findByUsername(username).orElse(null);
        if (guestUser != null) {
            return new User(
                    guestUser.getUsername(),
                    guestUser.getPassword(),
                    List.of(new SimpleGrantedAuthority("ROLE_" + guestUser.getRole()))
            );
        }

        throw new UsernameNotFoundException("User not found with username: " + username);
    }
}
