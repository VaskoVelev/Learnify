package com.vvelev.learnify.dtos.submissionаnswer;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SubmissionAnswerDto {
    private Long submissionId;
    private Long questionId;
    private String textAnswer;
    private Long answerId;
}
