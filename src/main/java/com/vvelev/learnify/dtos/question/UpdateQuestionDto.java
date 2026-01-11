package com.vvelev.learnify.dtos.question;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
@AllArgsConstructor
public class UpdateQuestionDto {
    @NotBlank(message = "Text is required")
    @Size(max = 2000)
    private String text;
}
