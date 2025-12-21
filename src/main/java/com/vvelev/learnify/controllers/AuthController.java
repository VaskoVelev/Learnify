package com.vvelev.learnify.controllers;

import com.vvelev.learnify.dtos.auth.LoginDto;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@AllArgsConstructor
@RestController
public class AuthController {
    private final AuthenticationManager authenticationManager;

    @PostMapping("/auth/login")
    public ResponseEntity<Void> login(@Valid @RequestBody LoginDto request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        return ResponseEntity.ok().build();
    }
}
