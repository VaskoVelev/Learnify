package com.vvelev.learnify.dtos.answer;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
@AllArgsConstructor
public class UpdateAnswerDto {
    @NotBlank(message = "Text is required")
    @Size(max = 1000)
    private String text;

    private boolean isCorrect;
}
