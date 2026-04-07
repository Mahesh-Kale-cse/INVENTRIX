package com.inventrix.service;

import com.inventrix.dto.RegisterRequest;
import com.inventrix.entity.User;
import com.inventrix.repository.UserRepository;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class UserService implements UserDetailsService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository,
            PasswordEncoder passwordEncoder) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // ✅ ROLE PREFIX FIX (IMPORTANT)
    @Override
    public UserDetails loadUserByUsername(String username)
            throws UsernameNotFoundException {

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));

        // ✅ ADMIN -> ROLE_ADMIN
        // ✅ STAFF -> ROLE_STAFF
        Set<GrantedAuthority> authorities = user.getRoles().stream()
                .map(role -> new SimpleGrantedAuthority("ROLE_" + role.name()))
                .collect(Collectors.toSet());

        return new org.springframework.security.core.userdetails.User(
                user.getUsername(),
                user.getPassword(),
                user.getIsActive(), // enabled
                true, // accountNonExpired
                true, // credentialsNonExpired
                true, // accountNonLocked
                authorities);
    }

    // ✅ SAFE USER REGISTRATION
    public User registerUser(RegisterRequest request) {

        if (userRepository.existsByUsername(request.getUsername())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Username already exists");
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Email already exists");
        }

        User user = new User();

        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setEmail(request.getEmail());
        user.setFullName(request.getFullName());
        user.setIsActive(true);

        // ✅ DEFAULT ROLE = STAFF
        Set<User.Role> roles = new HashSet<>();
        roles.add(User.Role.STAFF);
        user.setRoles(roles);

        return userRepository.save(user);
    }

    // ✅ FETCH USER BY USERNAME
    public User getUserByUsername(String username) {

        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));
    }

    // ✅ FETCH USER BY ID
    public User getUserById(Long id) {

        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
    }

    // ✅ FETCH ALL USERS
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // ✅ UPDATE USER PROFILE
    public User updateUser(Long id, User userDetails) {

        User user = getUserById(id);

        if (userDetails.getEmail() != null) {
            user.setEmail(userDetails.getEmail());
        }

        if (userDetails.getFullName() != null) {
            user.setFullName(userDetails.getFullName());
        }

        if (userDetails.getIsActive() != null) {
            user.setIsActive(userDetails.getIsActive());
        }

        return userRepository.save(user);
    }

    // ✅ FIX: Added updateProfile - called by AuthController PUT /auth/profile
    public User updateProfile(String username, String fullName, String email) {

        User user = getUserByUsername(username);

        // Check if new email is taken by a different user
        if (email != null && !email.equals(user.getEmail())) {
            if (userRepository.existsByEmail(email)) {
                throw new ResponseStatusException(
                        HttpStatus.CONFLICT,
                        "Email already in use");
            }
            user.setEmail(email);
        }

        if (fullName != null) {
            user.setFullName(fullName);
        }

        return userRepository.save(user);
    }

    // ✅ FIX: Added changePassword - called by AuthController PUT /auth/change-password
    public void changePassword(String username, String currentPassword, String newPassword) {

        User user = getUserByUsername(username);

        // Verify current password is correct
        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Current password is incorrect");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    // ✅ DELETE USER
    public void deleteUser(Long id) {

        User user = getUserById(id);
        userRepository.delete(user);
    }

    // ✅ ADD ROLE
    public void addRoleToUser(Long userId, User.Role role) {

        User user = getUserById(userId);
        user.getRoles().add(role);
        userRepository.save(user);
    }

    // ✅ REMOVE ROLE
    public void removeRoleFromUser(Long userId, User.Role role) {

        User user = getUserById(userId);
        user.getRoles().remove(role);
        userRepository.save(user);
    }
}