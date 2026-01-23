package com.vvelev.learnify.dtos.studentprogression;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
@AllArgsConstructor
public class StudentProgressionDto {
    private Long id;
    private Double progressionPercent;
    private Double averageScore;
    private Long studentId;
    private Long courseId;
}
