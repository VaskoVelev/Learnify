package com.vvelev.learnify.dtos.course;

import com.vvelev.learnify.entities.Category;
import com.vvelev.learnify.entities.Difficulty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
@AllArgsConstructor
public class CreateCourseDto {
    @NotBlank(message = "Title is required")
    @Size(max = 255)
    private String title;

    @Size(max = 5000)
    private String description;

    private Category category;
    private Difficulty difficulty;
    private String thumbnail;
}
