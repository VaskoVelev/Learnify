package com.vvelev.learnify.mappers;

import com.vvelev.learnify.dtos.course.CourseDto;
import com.vvelev.learnify.dtos.course.CreateCourseDto;
import com.vvelev.learnify.dtos.course.UpdateCourseDto;
import com.vvelev.learnify.entities.Course;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface CourseMapper {
    @Mapping(target = "createdById", source = "createdBy.id")
    CourseDto toDto(Course course);

    @Mapping(target = "createdBy", ignore = true)
    Course toEntity(CreateCourseDto dto);

    void update(UpdateCourseDto request, @MappingTarget Course course);
}
