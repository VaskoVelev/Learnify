package com.vvelev.learnify.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CourseDto {
    private Long id;
    private String title;
    private String description;
    private String category;
    private String difficulty;
    private String thumbnail;
    private Long createdById;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
