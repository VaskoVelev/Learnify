package com.vvelev.learnify.dtos.enrollment;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter @Setter
@AllArgsConstructor
public class EnrollmentDto {
    private Long studentId;
    private String studentFirstName;
    private String studentLastName;
    private Long courseId;
    private String title;
    private Long teacherId;
    private String teacherFirstName;
    private String teacherLastName;
    private LocalDateTime enrolledAt;
}
