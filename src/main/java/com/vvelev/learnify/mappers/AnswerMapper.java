package com.vvelev.learnify.mappers;

import com.vvelev.learnify.dtos.answer.CreateAnswerDto;
import com.vvelev.learnify.dtos.answer.StudentAnswerDto;
import com.vvelev.learnify.dtos.answer.TeacherAnswerDto;
import com.vvelev.learnify.dtos.answer.UpdateAnswerDto;
import com.vvelev.learnify.entities.Answer;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface AnswerMapper {
    @Mapping(target = "questionId", source = "question.id")
    TeacherAnswerDto toTeacherDto(Answer answer);

    @Mapping(target = "questionId", source = "question.id")
    StudentAnswerDto toStudentDto(Answer answer);

    @Mapping(target = "question", ignore = true)
    Answer toEntity(CreateAnswerDto dto);

    void update(UpdateAnswerDto request, @MappingTarget Answer answer);
}
