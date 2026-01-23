package com.vvelev.learnify.dtos.auth;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
@AllArgsConstructor
public class LoginResult {
    private String accessToken;
    private String refreshToken;
}
