package com.vvelev.learnify.mappers;

import com.vvelev.learnify.dtos.submission.SubmissionDetailsDto;
import com.vvelev.learnify.dtos.submission.SubmissionDto;
import com.vvelev.learnify.dtos.submissionanswer.SubmissionAnswerDetailsDto;
import com.vvelev.learnify.entities.Submission;
import com.vvelev.learnify.entities.SubmissionAnswer;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface SubmissionMapper {
    @Mapping(target = "quizId", source = "quiz.id")
    @Mapping(target = "studentId", source = "student.id")
    SubmissionDto toDto(Submission submission);

    @Mapping(target = "quizId", source = "quiz.id")
    @Mapping(target = "studentId", source = "student.id")
    @Mapping(target = "answers", source = "submissionAnswers")
    SubmissionDetailsDto toDetailsDto(Submission submission);

    default SubmissionAnswerDetailsDto toAnswerDetailsDto(SubmissionAnswer sa) {
        return new SubmissionAnswerDetailsDto(
                sa.getQuestion().getId(),
                sa.getQuestion().getText(),
                sa.getAnswer().getId(),
                sa.getAnswer().getText(),
                sa.getAnswer().isCorrect()
        );
    }

    default List<SubmissionAnswerDetailsDto> mapSubmissionAnswers(
            List<SubmissionAnswer> answers
    ) {
        return answers.stream()
                .map(this::toAnswerDetailsDto)
                .toList();
    }
}