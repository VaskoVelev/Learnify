package com.vvelev.learnify.dtos.submissionanswer;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
@AllArgsConstructor
public class SubmissionAnswerDetailsDto {
    private Long questionId;
    private String questionText;
    private Long chosenAnswerId;
    private String chosenAnswerText;
    private boolean isCorrect;
}
