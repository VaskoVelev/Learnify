package com.vvelev.learnify.dtos.lesson;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UpdateLessonDto {
    @NotBlank(message = "Title is required")
    @Size(max = 255)
    private String title;

    @Size(max = 10000)
    private String content;

    private String videoUrl;

    @NotNull
    @PositiveOrZero
    private Long orderIndex;
}
