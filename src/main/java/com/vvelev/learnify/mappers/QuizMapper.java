package com.vvelev.learnify.mappers;

import com.vvelev.learnify.dtos.quiz.CreateQuizDto;
import com.vvelev.learnify.dtos.quiz.QuizDto;
import com.vvelev.learnify.dtos.quiz.UpdateQuizDto;
import com.vvelev.learnify.entities.Quiz;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface QuizMapper {
    @Mapping(target = "courseId", source = "course.id")
    QuizDto toDto(Quiz quiz);

    @Mapping(target = "course", ignore = true)
    Quiz toEntity(CreateQuizDto dto);

    void update(UpdateQuizDto request, @MappingTarget Quiz quiz);
}
