package com.vvelev.learnify.dtos.submission;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter @Setter
@AllArgsConstructor
public class SubmissionDto {
    private Long id;
    private Double score;
    private LocalDateTime submittedAt;
    private Long quizId;
    private Long studentId;
}
