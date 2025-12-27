package com.vvelev.learnify.services;

import com.vvelev.learnify.dtos.auth.AuthResponseDto;
import com.vvelev.learnify.dtos.auth.LoginDto;
import com.vvelev.learnify.dtos.auth.LoginResult;
import com.vvelev.learnify.dtos.user.UserDto;
import com.vvelev.learnify.entities.User;
import com.vvelev.learnify.exceptions.InvalidTokenException;
import com.vvelev.learnify.exceptions.UserNotFoundException;
import com.vvelev.learnify.mappers.UserMapper;
import com.vvelev.learnify.repositories.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@AllArgsConstructor
@Service
public class AuthService {
    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthResponseDto refresh(String refreshToken) {
        Jwt jwt = jwtService.parseToken(refreshToken);
        if (jwt == null || jwt.isExpired()) {
            throw new InvalidTokenException();
        }

        User user = userRepository.findById(jwt.getId()).orElseThrow();
        if (!user.isActive()) {
            throw new DisabledException("User is inactive");
        }

        Jwt accessToken = jwtService.generateAccessToken(user);
        return new AuthResponseDto(accessToken.toString());
    }

    public LoginResult login(LoginDto request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        User user = userRepository.findByEmail(request.getEmail());
        Jwt accessToken = jwtService.generateAccessToken(user);
        Jwt refreshToken = jwtService.generateRefreshToken(user);

        return new LoginResult(accessToken.toString(), refreshToken.toString());
    }

    public UserDto getLoggedInUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Long id = (Long) authentication.getPrincipal();

        User user = userRepository.findById(id).orElse(null);
        if (user == null) {
            throw new UserNotFoundException();
        }

        return userMapper.toDto(user);
    }
}
