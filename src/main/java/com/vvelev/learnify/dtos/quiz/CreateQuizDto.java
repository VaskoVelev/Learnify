package com.vvelev.learnify.dtos.quiz;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CreateQuizDto {
    private String title;
    private String description;
    private Long courseId;
}
