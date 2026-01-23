package com.vvelev.learnify.mappers;

import com.vvelev.learnify.dtos.studentprogression.StudentProgressionDto;
import com.vvelev.learnify.entities.StudentProgression;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface StudentProgressionMapper {
    @Mapping(target = "studentId", source = "student.id")
    @Mapping(target = "courseId", source = "course.id")
    StudentProgressionDto toDto(StudentProgression progression);
}
