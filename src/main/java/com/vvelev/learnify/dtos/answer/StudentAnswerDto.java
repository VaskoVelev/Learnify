package com.vvelev.learnify.dtos.answer;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
@AllArgsConstructor
public class StudentAnswerDto {
    private Long id;
    private String text;
    private Long questionId;
}
