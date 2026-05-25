package com.vvelev.learnify.controllers;

import com.vvelev.learnify.config.JwtConfig;
import com.vvelev.learnify.constants.ApiPaths;
import com.vvelev.learnify.dtos.auth.AuthResponseDto;
import com.vvelev.learnify.dtos.auth.LoginDto;
import com.vvelev.learnify.dtos.auth.LoginResult;
import com.vvelev.learnify.services.AuthService;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@AllArgsConstructor
@RestController
public class AuthController {
    private final AuthService authService;
    private final JwtConfig  jwtConfig;

    @PostMapping(ApiPaths.AUTH_LOGIN)
    public ResponseEntity<AuthResponseDto> login(@Valid @RequestBody LoginDto request, HttpServletResponse response) {
        LoginResult result = authService.login(request);

        ResponseCookie cookie = ResponseCookie.from("refreshToken", result.getRefreshToken())
                .httpOnly(true)
                .path(ApiPaths.AUTH_REFRESH)
                .maxAge(jwtConfig.getRefreshTokenExpiration())
                .secure(true)
                .sameSite("None")
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
        return ResponseEntity.ok(new AuthResponseDto(result.getAccessToken()));
    }

    @PostMapping(ApiPaths.AUTH_REFRESH)
    public ResponseEntity<AuthResponseDto> refresh(@CookieValue(value = "refreshToken") String refreshToken) {
        AuthResponseDto authResponseDto = authService.refresh(refreshToken);
        return ResponseEntity.ok(authResponseDto);
    }

    @PostMapping(ApiPaths.AUTH_LOGOUT)
    public ResponseEntity<Void> logout(HttpServletResponse response) {
        ResponseCookie cookie = ResponseCookie.from("refreshToken", "")
                .httpOnly(true)
                .path(ApiPaths.AUTH_REFRESH)
                .maxAge(0)
                .secure(true)
                .sameSite("None")
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
        return ResponseEntity.ok().build();
    }
}
