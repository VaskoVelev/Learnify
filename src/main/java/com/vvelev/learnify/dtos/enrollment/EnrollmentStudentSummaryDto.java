package com.vvelev.learnify.dtos.enrollment;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class EnrollmentStudentSummaryDto {
    private Long id;
    private String firstName;
    private String lastName;
    private LocalDateTime enrolledAt;
}
