package com.vvelev.learnify.dtos.answer;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CreateAnswerDto {
    @NotBlank(message = "Text is required")
    @Size(max = 1000)
    private String text;

    @NotNull
    private boolean isCorrect;

    @NotNull
    private Long questionId;
}
