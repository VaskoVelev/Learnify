package com.vvelev.learnify.dtos.studentprogression;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UpdateStudentProgressionDto {
    private Double progressionPercent;
    private Double averageScore;
}
