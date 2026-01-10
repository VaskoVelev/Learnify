package com.vvelev.learnify.services;

import com.vvelev.learnify.dtos.user.RegisterUserDto;
import com.vvelev.learnify.dtos.user.UpdateUserDto;
import com.vvelev.learnify.dtos.user.UserDto;
import com.vvelev.learnify.entities.User;
import com.vvelev.learnify.exceptions.AccessDeniedException;
import com.vvelev.learnify.exceptions.EmailAlreadyExistsException;
import com.vvelev.learnify.exceptions.PasswordsDoNotMatchException;
import com.vvelev.learnify.exceptions.UserNotFoundException;
import com.vvelev.learnify.mappers.UserMapper;
import com.vvelev.learnify.repositories.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
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

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email);
        if (user == null) {
            throw new UsernameNotFoundException("User not found");
        }

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
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new EmailAlreadyExistsException();
        }

        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new PasswordsDoNotMatchException();
        }

        User user = userMapper.toEntity(request);
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setRole(user.getRole());
        user.setActive(true);
        userRepository.save(user);

        return userMapper.toDto(user);
    }

    public List<UserDto> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(userMapper::toDto)
                .toList();
    }

    public UserDto getUser(Long id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Long userId = (Long) authentication.getPrincipal();

        if (!userId.equals(id)) {
            throw new AccessDeniedException();
        }

        User user = userRepository.findById(id).orElse(null);
        if (user == null) {
            throw new UserNotFoundException();
        }

        return userMapper.toDto(user);
    }

    public UserDto updateUser(Long id, UpdateUserDto request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Long userId = (Long) authentication.getPrincipal();

        if (!userId.equals(id)) {
            throw new AccessDeniedException();
        }

        User user = userRepository.findById(id).orElse(null);
        if (user == null) {
            throw new UserNotFoundException();
        }

        userMapper.update(request, user);
        userRepository.save(user);

        return userMapper.toDto(user);
    }

    public void deleteUser(Long id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Long userId = (Long) authentication.getPrincipal();

        if (!userId.equals(id)) {
            throw new AccessDeniedException();
        }

        User user = userRepository.findById(id).orElse(null);
        if (user == null) {
            throw new UserNotFoundException();
        }

        userRepository.delete(user);
    }
}
