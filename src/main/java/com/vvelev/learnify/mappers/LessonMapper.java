package com.vvelev.learnify.mappers;

import com.vvelev.learnify.dtos.lesson.CreateLessonDto;
import com.vvelev.learnify.dtos.lesson.LessonDto;
import com.vvelev.learnify.dtos.lesson.UpdateLessonDto;
import com.vvelev.learnify.entities.Lesson;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface LessonMapper {
    @Mapping(target = "courseId", source = "course.id")
    LessonDto toDto(Lesson lesson);

    @Mapping(target = "course", ignore = true)
    Lesson toEntity(CreateLessonDto dto);

    void update(UpdateLessonDto request, @MappingTarget Lesson lesson);
}
