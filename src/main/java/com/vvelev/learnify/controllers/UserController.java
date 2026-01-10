package com.vvelev.learnify.controllers;

import com.vvelev.learnify.dtos.user.RegisterUserDto;
import com.vvelev.learnify.dtos.user.UpdateUserDto;
import com.vvelev.learnify.dtos.user.UserDto;
import com.vvelev.learnify.services.UserService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.util.List;

@AllArgsConstructor
@RestController
public class UserController {
    private final UserService userService;

    @PostMapping("/users")
    public ResponseEntity<?> registerUser(
            @Valid @RequestBody RegisterUserDto request,
            UriComponentsBuilder uriBuilder
    ) {
        UserDto userDto = userService.registerUser(request);
        URI uri = uriBuilder.path("/users/{id}").buildAndExpand(userDto.getId()).toUri();

        return ResponseEntity.created(uri).body(userDto);
    }

    @GetMapping("/users")
    public List<UserDto> getAllUsers() {
        return userService.getAllUsers();
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<UserDto> getUser(@PathVariable Long id) {
        UserDto userDto = userService.getUser(id);
        return ResponseEntity.ok(userDto);
    }

    @PutMapping("/users/{id}")
    public ResponseEntity<UserDto> updateUser(
            @PathVariable Long id,
            @Valid @RequestBody UpdateUserDto request
    ) {
        UserDto userDto = userService.updateUser(id, request);
        return ResponseEntity.ok(userDto);
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
}
