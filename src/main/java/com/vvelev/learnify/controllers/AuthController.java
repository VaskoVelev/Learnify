package com.vvelev.learnify.controllers;

import com.vvelev.learnify.config.JwtConfig;
import com.vvelev.learnify.dtos.auth.AuthResponseDto;
import com.vvelev.learnify.dtos.auth.LoginDto;
import com.vvelev.learnify.dtos.user.UserDto;
import com.vvelev.learnify.entities.User;
import com.vvelev.learnify.mappers.UserMapper;
import com.vvelev.learnify.repositories.UserRepository;
import com.vvelev.learnify.services.Jwt;
import com.vvelev.learnify.services.JwtService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@AllArgsConstructor
@RestController
public class AuthController {
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final JwtConfig  jwtConfig;
    private final UserRepository userRepository;
    private final UserMapper userMapper;

    @PostMapping("/auth/login")
    public ResponseEntity<AuthResponseDto> login(@Valid @RequestBody LoginDto request, HttpServletResponse response) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        User user = userRepository.findByEmail(request.getEmail());
        Jwt accessToken = jwtService.generateAccessToken(user);
        Jwt refreshToken = jwtService.generateRefreshToken(user);

        Cookie cookie = new Cookie("refreshToken", refreshToken.toString());
        cookie.setHttpOnly(true);
        cookie.setPath("/auth/refresh");
        cookie.setMaxAge(jwtConfig.getRefreshTokenExpiration());
        cookie.setSecure(true);
        response.addCookie(cookie);

        return ResponseEntity.ok(new AuthResponseDto(accessToken.toString()));
    }

    @PostMapping("/auth/refresh")
    public ResponseEntity<AuthResponseDto> refresh(@CookieValue(value = "refreshToken") String refreshToken) {
        Jwt jwt = jwtService.parseToken(refreshToken);
        if (jwt == null || jwt.isExpired()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        User user = userRepository.findById(jwt.getId()).orElseThrow();
        Jwt accessToken = jwtService.generateAccessToken(user);

        return ResponseEntity.ok(new AuthResponseDto(accessToken.toString()));
    }

    @GetMapping("/auth/me")
    public ResponseEntity<UserDto> me() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Long id = (Long) authentication.getPrincipal();

        User user = userRepository.findById(id).orElse(null);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }

        UserDto userDto = userMapper.toDto(user);
        return ResponseEntity.ok(userDto);
    }
}
