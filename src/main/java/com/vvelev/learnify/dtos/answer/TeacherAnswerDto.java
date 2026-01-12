package com.vvelev.learnify.dtos.answer;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
@AllArgsConstructor
public class TeacherAnswerDto {
    private Long id;
    private String text;
    private boolean isCorrect;
    private Long questionId;
}
