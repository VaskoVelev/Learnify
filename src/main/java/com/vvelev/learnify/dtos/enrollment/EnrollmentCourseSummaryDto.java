package com.vvelev.learnify.dtos.enrollment;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class EnrollmentCourseSummaryDto {
    private Long id;
    private String title;
    private Long teacherId;
    private String firstName;
    private String lastName;
    private LocalDateTime enrolledAt;
}
