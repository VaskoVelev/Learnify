package com.vvelev.learnify.services;

import com.vvelev.learnify.dtos.user.RegisterUserDto;
import com.vvelev.learnify.dtos.user.UpdateUserDto;
import com.vvelev.learnify.dtos.user.UserDto;
import com.vvelev.learnify.entities.Role;
import com.vvelev.learnify.entities.User;
import com.vvelev.learnify.exceptions.EmailAlreadyExistsException;
import com.vvelev.learnify.exceptions.PasswordsDoNotMatchException;
import com.vvelev.learnify.exceptions.UserNotFoundException;
import com.vvelev.learnify.mappers.UserMapper;
import com.vvelev.learnify.repositories.UserRepository;
import com.vvelev.learnify.utils.SecurityUtils;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class UserServiceTest {
    @Mock private UserRepository userRepository;
    @Mock private UserMapper userMapper;
    @Mock private PasswordEncoder passwordEncoder;
    @Mock private SecurityUtils securityUtils;

    @InjectMocks
    private UserService userService;

    private User user;
    private UserDto userDto;
    private RegisterUserDto registerUserDto;
    private UpdateUserDto updateUserDto;

    @BeforeEach
    void setUp() {
        LocalDateTime now = LocalDateTime.now();

        user = new User();
        user.setId(1L);
        user.setEmail("test@example.com");
        user.setPassword("encodedPassword");
        user.setFirstName("John");
        user.setLastName("Doe");
        user.setRole(Role.TEACHER);
        user.setActive(true);
        user.setCreatedAt(now);

        userDto = new UserDto(
                "1",
                "test@example.com",
                "John",
                "Doe",
                now,
                true,
                Role.TEACHER
        );

        registerUserDto = new RegisterUserDto(
                "newuser@example.com",
                "password123",
                "password123",
                "Jane",
                "Smith",
                Role.STUDENT
        );

        updateUserDto = new UpdateUserDto(
                "UpdatedFirstName",
                "UpdatedLastName"
        );
    }

    /* -------------------- Load User By Username -------------------- */

    @Test
    void loadUserByUsername_ShouldReturnUserDetails_WhenUserExistsAndActive() {
        when(userRepository.findByEmail(user.getEmail())).thenReturn(user);

        UserDetails userDetails = userService.loadUserByUsername(user.getEmail());

        assertNotNull(userDetails);
        assertEquals(user.getEmail(), userDetails.getUsername());
        assertEquals(user.getPassword(), userDetails.getPassword());

        verify(userRepository, times(1)).findByEmail(user.getEmail());
    }

    @Test
    void loadUserByUsername_ShouldThrowUsernameNotFoundException_WhenUserNotFound() {
        String nonExistentEmail = "nonexistent@example.com";
        when(userRepository.findByEmail(nonExistentEmail)).thenReturn(null);

        assertThrows(
                UsernameNotFoundException.class,
                () -> userService.loadUserByUsername(nonExistentEmail)
        );

        verify(userRepository, times(1)).findByEmail(nonExistentEmail);
    }

    @Test
    void loadUserByUsername_ShouldThrowDisabledException_WhenUserIsInactive() {
        user.setActive(false);
        when(userRepository.findByEmail(user.getEmail())).thenReturn(user);

        assertThrows(
                DisabledException.class,
                () -> userService.loadUserByUsername(user.getEmail())
        );

        verify(userRepository, times(1)).findByEmail(user.getEmail());
    }

    /* -------------------- Register User -------------------- */

    @Test
    void registerUser_ShouldRegisterUser_WhenEmailIsNotRegisteredAndPasswordsMatch() {
        User newUser = new User();
        newUser.setId(2L);
        newUser.setEmail(registerUserDto.getEmail());
        newUser.setPassword(registerUserDto.getPassword());
        newUser.setFirstName(registerUserDto.getFirstName());
        newUser.setLastName(registerUserDto.getLastName());
        newUser.setRole(registerUserDto.getRole());
        newUser.setActive(true);

        UserDto newUserDto = new UserDto(
                "2",
                registerUserDto.getEmail(),
                registerUserDto.getFirstName(),
                registerUserDto.getLastName(),
                LocalDateTime.now(),
                true,
                registerUserDto.getRole()
        );

        when(userRepository.existsByEmail(registerUserDto.getEmail())).thenReturn(false);
        when(userMapper.toEntity(registerUserDto)).thenReturn(newUser);
        when(passwordEncoder.encode(registerUserDto.getPassword())).thenReturn("encodedPassword");
        when(userRepository.save(newUser)).thenReturn(newUser);
        when(userMapper.toDto(newUser)).thenReturn(newUserDto);

        UserDto result = userService.registerUser(registerUserDto);

        assertNotNull(result);
        assertEquals(registerUserDto.getEmail(), result.getEmail());
        assertEquals(registerUserDto.getFirstName(), result.getFirstName());
        assertEquals(registerUserDto.getLastName(), result.getLastName());
        assertEquals(registerUserDto.getRole(), result.getRole());
        assertTrue(result.isActive());

        assertEquals("encodedPassword", newUser.getPassword());

        verify(userRepository, times(1)).existsByEmail(registerUserDto.getEmail());
        verify(userMapper, times(1)).toEntity(registerUserDto);
        verify(passwordEncoder, times(1)).encode(registerUserDto.getPassword());
        verify(userRepository, times(1)).save(newUser);
        verify(userMapper, times(1)).toDto(newUser);
    }

    @Test
    void registerUser_ShouldThrowEmailAlreadyExistsException_WhenEmailIsRegistered() {
        when(userRepository.existsByEmail(registerUserDto.getEmail())).thenReturn(true);

        assertThrows(
                EmailAlreadyExistsException.class,
                () -> userService.registerUser(registerUserDto)
        );

        verify(userRepository, times(1)).existsByEmail(registerUserDto.getEmail());
        verifyNoInteractions(userMapper, passwordEncoder);
    }

    @Test
    void registerUser_ShouldThrowPasswordsDoNotMatchException_WhenPasswordsDiffer() {
        RegisterUserDto mismatchedPasswordsDto = new RegisterUserDto(
                "test@example.com",
                "password123",
                "differentPassword",
                "John",
                "Doe",
                Role.TEACHER
        );

        when(userRepository.existsByEmail(mismatchedPasswordsDto.getEmail())).thenReturn(false);

        assertThrows(
                PasswordsDoNotMatchException.class,
                () -> userService.registerUser(mismatchedPasswordsDto)
        );

        verify(userRepository, times(1)).existsByEmail(mismatchedPasswordsDto.getEmail());
        verifyNoInteractions(userMapper, passwordEncoder);
    }

    /* -------------------- Get All Users -------------------- */

    @Test
    void getAllUsers_ShouldReturnAllUsers() {
        when(userRepository.findAll()).thenReturn(List.of(user));
        when(userMapper.toDto(user)).thenReturn(userDto);

        List<UserDto> result = userService.getAllUsers();

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("test@example.com", result.get(0).getEmail());

        verify(userRepository, times(1)).findAll();
        verify(userMapper, times(1)).toDto(any(User.class));
    }

    @Test
    void getAllUsers_ShouldReturnEmptyList_WhenNoUsersExist() {
        when(userRepository.findAll()).thenReturn(List.of());

        List<UserDto> result = userService.getAllUsers();

        assertNotNull(result);
        assertTrue(result.isEmpty());

        verify(userRepository, times(1)).findAll();
        verify(userMapper, never()).toDto(any(User.class));
    }

    /* -------------------- Get User -------------------- */

    @Test
    void getUser_ShouldReturnUser_WhenUserExists() {
        when(userRepository.findById(user.getId())).thenReturn(Optional.of(user));
        when(userMapper.toDto(user)).thenReturn(userDto);

        UserDto result = userService.getUser(user.getId());

        assertNotNull(result);
        assertEquals(userDto.getId(), result.getId());
        assertEquals(userDto.getEmail(), result.getEmail());
        assertEquals(userDto.getFirstName(), result.getFirstName());
        assertEquals(userDto.getLastName(), result.getLastName());
        assertEquals(userDto.getRole(), result.getRole());

        verify(userRepository, times(1)).findById(user.getId());
        verify(userMapper, times(1)).toDto(user);
    }

    @Test
    void getUser_ShouldThrowUserNotFoundException_WhenUserNotFound() {
        Long nonExistentUserId = 999L;
        when(userRepository.findById(nonExistentUserId)).thenReturn(Optional.empty());

        assertThrows(
                UserNotFoundException.class,
                () -> userService.getUser(nonExistentUserId)
        );

        verify(userRepository, times(1)).findById(nonExistentUserId);
        verifyNoInteractions(userMapper);
    }

    /* -------------------- Get Me -------------------- */

    @Test
    void getMe_ShouldReturnCurrentUser() {
        when(securityUtils.getCurrentUserId()).thenReturn(user.getId());
        when(userRepository.findById(user.getId())).thenReturn(Optional.of(user));
        when(userMapper.toDto(user)).thenReturn(userDto);

        UserDto result = userService.getMe();

        assertNotNull(result);
        assertEquals(userDto.getId(), result.getId());
        assertEquals(userDto.getEmail(), result.getEmail());
        assertEquals(userDto.getFirstName(), result.getFirstName());
        assertEquals(userDto.getLastName(), result.getLastName());
        assertEquals(userDto.getRole(), result.getRole());

        verify(securityUtils, times(1)).getCurrentUserId();
        verify(userRepository, times(1)).findById(user.getId());
        verify(userMapper, times(1)).toDto(user);
    }

    @Test
    void getMe_ShouldThrowUserNotFoundException_WhenCurrentUserNotFound() {
        Long nonExistentUserId = 999L;
        when(securityUtils.getCurrentUserId()).thenReturn(nonExistentUserId);
        when(userRepository.findById(nonExistentUserId)).thenReturn(Optional.empty());

        assertThrows(
                UserNotFoundException.class,
                () -> userService.getMe()
        );

        verify(securityUtils, times(1)).getCurrentUserId();
        verify(userRepository, times(1)).findById(nonExistentUserId);
        verifyNoInteractions(userMapper);
    }

    /* -------------------- Update User -------------------- */

    @Test
    void updateUser_ShouldUpdateUser_WhenUserExists() {
        when(userRepository.findById(user.getId())).thenReturn(Optional.of(user));
        doNothing().when(userMapper).update(updateUserDto, user);
        when(userRepository.save(user)).thenReturn(user);

        UserDto updatedUserDto = new UserDto(
                userDto.getId(),
                userDto.getEmail(),
                updateUserDto.getFirstName(),
                updateUserDto.getLastName(),
                userDto.getCreatedAt(),
                userDto.isActive(),
                userDto.getRole()
        );

        when(userMapper.toDto(user)).thenReturn(updatedUserDto);


        UserDto result = userService.updateUser(user.getId(), updateUserDto);

        assertNotNull(result);
        assertEquals(updateUserDto.getFirstName(), result.getFirstName());
        assertEquals(updateUserDto.getLastName(), result.getLastName());
        assertEquals(user.getEmail(), result.getEmail());
        assertEquals(user.getRole(), result.getRole());

        verify(userRepository, times(1)).findById(user.getId());
        verify(userMapper, times(1)).update(updateUserDto, user);
        verify(userRepository, times(1)).save(user);
        verify(userMapper, times(1)).toDto(user);
    }

    @Test
    void updateUser_ShouldThrowUserNotFoundException_WhenUserNotFound() {
        Long nonExistentUserId = 999L;
        when(userRepository.findById(nonExistentUserId)).thenReturn(Optional.empty());

        assertThrows(
                UserNotFoundException.class,
                () -> userService.updateUser(nonExistentUserId, updateUserDto)
        );

        verify(userRepository, times(1)).findById(nonExistentUserId);
        verifyNoInteractions(userMapper);
    }

    /* -------------------- Update Me -------------------- */

    @Test
    void updateMe_ShouldUpdateCurrentUser() {
        when(securityUtils.getCurrentUserId()).thenReturn(user.getId());
        when(userRepository.findById(user.getId())).thenReturn(Optional.of(user));
        doNothing().when(userMapper).update(updateUserDto, user);
        when(userRepository.save(user)).thenReturn(user);

        UserDto updatedUserDto = new UserDto(
                userDto.getId(),
                userDto.getEmail(),
                updateUserDto.getFirstName(),
                updateUserDto.getLastName(),
                userDto.getCreatedAt(),
                userDto.isActive(),
                userDto.getRole()
        );

        when(userMapper.toDto(user)).thenReturn(updatedUserDto);

        UserDto result = userService.updateMe(updateUserDto);

        assertNotNull(result);
        assertEquals(updateUserDto.getFirstName(), result.getFirstName());
        assertEquals(updateUserDto.getLastName(), result.getLastName());

        verify(securityUtils, times(1)).getCurrentUserId();
        verify(userRepository, times(1)).findById(user.getId());
        verify(userMapper, times(1)).update(updateUserDto, user);
        verify(userRepository, times(1)).save(user);
        verify(userMapper, times(1)).toDto(user);
    }

    @Test
    void updateMe_ShouldThrowUserNotFoundException_WhenCurrentUserNotFound() {
        Long nonExistentUserId = 999L;
        when(securityUtils.getCurrentUserId()).thenReturn(nonExistentUserId);
        when(userRepository.findById(nonExistentUserId)).thenReturn(Optional.empty());

        assertThrows(
                UserNotFoundException.class,
                () -> userService.updateMe(updateUserDto)
        );

        verify(securityUtils, times(1)).getCurrentUserId();
        verify(userRepository, times(1)).findById(nonExistentUserId);
        verifyNoInteractions(userMapper);
    }

    /* -------------------- Delete Me -------------------- */

    @Test
    void deleteMe_ShouldDeleteCurrentUser() {
        when(securityUtils.getCurrentUserId()).thenReturn(user.getId());
        when(userRepository.findById(user.getId())).thenReturn(Optional.of(user));
        doNothing().when(userRepository).delete(user);

        userService.deleteMe();

        verify(securityUtils, times(1)).getCurrentUserId();
        verify(userRepository, times(1)).findById(user.getId());
        verify(userRepository, times(1)).delete(user);
    }

    @Test
    void deleteMe_ShouldThrowUserNotFoundException_WhenCurrentUserNotFound() {
        Long nonExistentUserId = 999L;
        when(securityUtils.getCurrentUserId()).thenReturn(nonExistentUserId);
        when(userRepository.findById(nonExistentUserId)).thenReturn(Optional.empty());

        assertThrows(
                UserNotFoundException.class,
                () -> userService.deleteMe()
        );

        verify(securityUtils, times(1)).getCurrentUserId();
        verify(userRepository, times(1)).findById(nonExistentUserId);
        verify(userRepository, never()).delete(any(User.class));
    }
}
