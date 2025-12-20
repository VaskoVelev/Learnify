package com.vvelev.learnify.mappers;

import com.vvelev.learnify.dtos.auth.RegisterDto;
import com.vvelev.learnify.dtos.user.UpdateUserDto;
import com.vvelev.learnify.dtos.user.UserDto;
import com.vvelev.learnify.entities.User;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface UserMapper {
    UserDto toDto(User user);
    User toEntity(RegisterDto dto);
    void update(UpdateUserDto request, @MappingTarget User user);
}
