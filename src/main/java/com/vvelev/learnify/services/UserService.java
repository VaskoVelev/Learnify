package com.vvelev.learnify.services;

import com.vvelev.learnify.dtos.user.RegisterUserDto;
import com.vvelev.learnify.dtos.user.UpdateUserDto;
import com.vvelev.learnify.dtos.user.UserDto;
import com.vvelev.learnify.entities.User;
import com.vvelev.learnify.exceptions.EmailAlreadyExistsException;
import com.vvelev.learnify.exceptions.PasswordsDoNotMatchException;
import com.vvelev.learnify.exceptions.UserNotFoundException;
import com.vvelev.learnify.mappers.UserMapper;
import com.vvelev.learnify.repositories.UserRepository;
import com.vvelev.learnify.utils.SecurityUtils;
import lombok.AllArgsConstructor;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@AllArgsConstructor
@Service
public class UserService implements UserDetailsService {
    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final SecurityUtils securityUtils;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = getUserByEmailOrThrow(email);

        if (!user.isActive()) {
            throw new DisabledException("User is inactive");
        }

        return new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPassword(),
                Collections.emptyList()
        );
    }

    public UserDto registerUser(RegisterUserDto request) {
        if (isEmailRegistered(request.getEmail())) {
            throw new EmailAlreadyExistsException();
        }

        if (!passwordsMatch(request.getPassword(), request.getConfirmPassword())) {
            throw new PasswordsDoNotMatchException();
        }

        User user = userMapper.toEntity(request);
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setActive(true);
        userRepository.save(user);

        return userMapper.toDto(user);
    }

    public List<UserDto> getAllUsers() {
        return userRepository
                .findAll()
                .stream()
                .map(userMapper::toDto)
                .toList();
    }

    public UserDto getUser(Long userId) {
        User user = getUserOrThrow(userId);
        return userMapper.toDto(user);
    }

    public UserDto getMe() {
        Long userId = securityUtils.getCurrentUserId();
        User user = getUserOrThrow(userId);

        return userMapper.toDto(user);
    }

    public UserDto updateUser(Long userId, UpdateUserDto request) {
        User user = getUserOrThrow(userId);

        userMapper.update(request, user);
        userRepository.save(user);

        return userMapper.toDto(user);
    }

    public UserDto updateMe(UpdateUserDto request) {
        Long userId = securityUtils.getCurrentUserId();
        User user = getUserOrThrow(userId);

        userMapper.update(request, user);
        userRepository.save(user);

        return userMapper.toDto(user);
    }

    public void deleteMe() {
        Long userId = securityUtils.getCurrentUserId();
        User user = getUserOrThrow(userId);

        userRepository.delete(user);
    }

    private User getUserByEmailOrThrow(String email) {
        User user = userRepository.findByEmail(email);
        if (user == null) {
            throw new UsernameNotFoundException("User not found");
        }

        return user;
    }

    private User getUserOrThrow(Long userId) {
        return userRepository
                .findById(userId)
                .orElseThrow(UserNotFoundException::new);
    }

    private boolean isEmailRegistered(String email) {
        return userRepository.existsByEmail(email);
    }

    private boolean passwordsMatch(String password, String confirmPassword) {
        return password.equals(confirmPassword);
    }
}
