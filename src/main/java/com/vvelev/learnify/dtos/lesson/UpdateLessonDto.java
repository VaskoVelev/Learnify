package com.vvelev.learnify.dtos.lesson;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
@AllArgsConstructor
public class UpdateLessonDto {
    @NotBlank(message = "Title is required")
    @Size(max = 255)
    private String title;

    @Size(max = 10000)
    private String content;

    private String videoUrl;
}
