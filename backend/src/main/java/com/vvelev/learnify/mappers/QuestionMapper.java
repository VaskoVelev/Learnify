package com.vvelev.learnify.mappers;

import com.vvelev.learnify.dtos.question.CreateQuestionDto;
import com.vvelev.learnify.dtos.question.QuestionDto;
import com.vvelev.learnify.dtos.question.UpdateQuestionDto;
import com.vvelev.learnify.entities.Question;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface QuestionMapper {
    @Mapping(target = "quizId", source = "quiz.id")
    QuestionDto toDto(Question question);

    @Mapping(target = "quiz", ignore = true)
    Question toEntity(CreateQuestionDto dto);

    void update(UpdateQuestionDto request, @MappingTarget Question question);
}
