package com.vvelev.learnify.dtos.course;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UpdateCourseDto {
    @NotBlank(message = "Title is required")
    @Size(max = 255)
    private String title;

    @Size(max = 5000)
    private String description;

    @Size(max = 100)
    private String category;

    @NotBlank
    private String difficulty;

    private String thumbnail;
}
