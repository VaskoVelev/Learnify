package com.vvelev.learnify.dtos.course;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UpdateCourseDto {
    private String title;
    private String description;
    private String category;
    private String difficulty;
    private String thumbnail;
}
