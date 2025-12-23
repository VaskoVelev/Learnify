package com.vvelev.learnify.controllers;

import com.vvelev.learnify.config.JwtConfig;
import com.vvelev.learnify.dtos.auth.AuthResponseDto;
import com.vvelev.learnify.dtos.auth.LoginDto;
import com.vvelev.learnify.dtos.auth.LoginResult;
import com.vvelev.learnify.dtos.user.UserDto;
import com.vvelev.learnify.services.AuthService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@AllArgsConstructor
@RestController
public class AuthController {
    private final AuthService authService;
    private final JwtConfig  jwtConfig;

    @PostMapping("/auth/login")
    public ResponseEntity<AuthResponseDto> login(@Valid @RequestBody LoginDto request, HttpServletResponse response) {
        LoginResult result = authService.login(request);

        Cookie cookie = new Cookie("refreshToken", result.getRefreshToken());
        cookie.setHttpOnly(true);
        cookie.setPath("/auth/refresh");
        cookie.setMaxAge(jwtConfig.getRefreshTokenExpiration());
        cookie.setSecure(true);

        response.addCookie(cookie);
        return ResponseEntity.ok(new AuthResponseDto(result.getAccessToken()));
    }

    @PostMapping("/auth/refresh")
    public ResponseEntity<AuthResponseDto> refresh(@CookieValue(value = "refreshToken") String refreshToken) {
        AuthResponseDto authResponseDto = authService.refresh(refreshToken);
        return ResponseEntity.ok(authResponseDto);
    }

    @GetMapping("/auth/me")
    public ResponseEntity<UserDto> me() {
        UserDto userDto = authService.getLoggedInUser();
        return ResponseEntity.ok(userDto);
    }
}
