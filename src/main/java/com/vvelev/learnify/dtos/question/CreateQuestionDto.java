package com.vvelev.learnify.dtos.question;

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
public class CreateQuestionDto {
    @NotBlank(message = "Text is required")
    @Size(max = 2000)
    private String text;

    @NotBlank
    private String type;

    @NotNull
    private Long quizId;
}
