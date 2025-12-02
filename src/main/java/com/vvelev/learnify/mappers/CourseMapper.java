package com.vvelev.learnify.mappers;

import com.vvelev.learnify.dtos.CourseDto;
import com.vvelev.learnify.dtos.CreateCourseDto;
import com.vvelev.learnify.entities.Course;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface CourseMapper {
    CourseDto toDto(Course course);
    Course toEntity(CreateCourseDto dto);
}
