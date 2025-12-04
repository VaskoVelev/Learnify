package com.vvelev.learnify.dtos.lesson;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CreateLessonDto {
    private Long courseId;
    private String title;
    private String content;
    private String videoUrl;
    private Long orderIndex;
}
