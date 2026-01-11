package com.vvelev.learnify.dtos.enrollment;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter @Setter
@AllArgsConstructor
public class EnrollmentStudentSummaryDto {
    private Long id;
    private String firstName;
    private String lastName;
    private LocalDateTime enrolledAt;
}
