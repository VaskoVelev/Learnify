package com.vvelev.learnify.dtos.lesson;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
@AllArgsConstructor
public class LessonDto {
    private Long id;
    private String title;
    private String content;
    private String videoUrl;
    private Long orderIndex;
    private Long courseId;
}
