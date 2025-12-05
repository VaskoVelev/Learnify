package com.vvelev.learnify.dtos.answer;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CreateAnswerDto {
    private String text;
    private boolean isCorrect;
    private Long questionId;
}
