package com.vvelev.learnify.mappers;

import com.vvelev.learnify.dtos.enrollment.EnrollmentDto;
import com.vvelev.learnify.entities.Enrollment;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface EnrollmentMapper {
    @Mapping(target = "studentId", source = "student.id")
    @Mapping(target = "courseId", source = "course.id")
    EnrollmentDto toDto(Enrollment enrollment);
}
