package com.vvelev.learnify.dtos.submission;

import com.vvelev.learnify.dtos.submissionanswer.SubmissionAnswerDetailsDto;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter @Setter
@AllArgsConstructor
public class SubmissionDetailsDto {
    private Long id;
    private Double score;
    private LocalDateTime submittedAt;
    private Long quizId;
    private Long studentId;
    private List<SubmissionAnswerDetailsDto> answers;
}
