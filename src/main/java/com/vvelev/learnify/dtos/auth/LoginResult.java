package com.vvelev.learnify.dtos.auth;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class LoginResult {
    private String accessToken;
    private String refreshToken;
}
