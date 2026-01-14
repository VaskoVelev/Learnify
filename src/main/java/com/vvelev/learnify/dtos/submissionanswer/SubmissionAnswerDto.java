package com.vvelev.learnify.dtos.submissionanswer;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
@AllArgsConstructor
public class SubmissionAnswerDto {
    private Long questionId;
    private Long answerId;
}
