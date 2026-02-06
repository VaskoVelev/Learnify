package com.vvelev.learnify.dtos.course;

import com.vvelev.learnify.entities.Category;
import com.vvelev.learnify.entities.Difficulty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter @Setter
@AllArgsConstructor
public class CourseDto {
    private Long id;
    private String title;
    private String description;
    private Category category;
    private String thumbnail;
    private Long createdById;
    private String creatorFirstName;
    private String creatorLastName;
    private String creatorEmail;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Difficulty difficulty;
}
