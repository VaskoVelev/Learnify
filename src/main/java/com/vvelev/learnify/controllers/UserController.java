package com.vvelev.learnify.controllers;

import com.vvelev.learnify.constants.ApiPaths;
import com.vvelev.learnify.dtos.user.RegisterUserDto;
import com.vvelev.learnify.dtos.user.UpdateUserDto;
import com.vvelev.learnify.dtos.user.UserDto;
import com.vvelev.learnify.services.UserService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.util.List;

@AllArgsConstructor
@RestController
public class UserController {
    private final UserService userService;

    @PostMapping(ApiPaths.USERS)
    public ResponseEntity<?> registerUser(
            @Valid @RequestBody RegisterUserDto request,
            UriComponentsBuilder uriBuilder
    ) {
        UserDto userDto = userService.registerUser(request);
        URI uri = uriBuilder.path(ApiPaths.USER_BY_ID).buildAndExpand(userDto.getId()).toUri();

        return ResponseEntity.created(uri).body(userDto);
    }

    @PreAuthorize("Role.ADMIN.name()")
    @GetMapping(ApiPaths.USERS)
    public List<UserDto> getAllUsers() {
        return userService.getAllUsers();
    }

    @PreAuthorize("Role.ADMIN.name()")
    @GetMapping(ApiPaths.USER_BY_ID)
    public ResponseEntity<UserDto> getUser(@PathVariable Long id) {
        UserDto userDto = userService.getUser(id);
        return ResponseEntity.ok(userDto);
    }

    @GetMapping(ApiPaths.ME)
    public ResponseEntity<UserDto> getMe() {
        UserDto userDto = userService.getMe();
        return ResponseEntity.ok(userDto);
    }

    @PreAuthorize("Role.ADMIN.name()")
    @PutMapping(ApiPaths.USER_BY_ID)
    public ResponseEntity<UserDto> updateUser(
            @PathVariable Long id,
            @Valid @RequestBody UpdateUserDto request
    ) {
        UserDto userDto = userService.updateUser(id, request);
        return ResponseEntity.ok(userDto);
    }

    @PutMapping(ApiPaths.ME)
    public ResponseEntity<UserDto> updateMe(@Valid @RequestBody UpdateUserDto request) {
        UserDto userDto = userService.updateMe(request);
        return ResponseEntity.ok(userDto);
    }

    @DeleteMapping(ApiPaths.ME)
    public ResponseEntity<Void> deleteMe() {
        userService.deleteMe();
        return ResponseEntity.noContent().build();
    }
}
