package com.vvelev.learnify.controllers;

import com.vvelev.learnify.dtos.enrollment.EnrollmentCourseSummaryDto;
import com.vvelev.learnify.dtos.enrollment.EnrollmentDto;
import com.vvelev.learnify.dtos.enrollment.EnrollmentStudentSummaryDto;
import com.vvelev.learnify.services.EnrollmentService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@AllArgsConstructor
@RestController
public class EnrollmentController {
    private final EnrollmentService enrollmentService;

    // Enrolls a student in a given course
    @PostMapping("users/{studentId}/enroll/courses/{courseId}/")
    public ResponseEntity<?> enrollStudent(
            @PathVariable Long studentId,
            @PathVariable Long courseId
    ) {
        EnrollmentDto enrollmentDto = enrollmentService.enrollStudent(studentId, courseId);
        return ResponseEntity.status(HttpStatus.CREATED).body(enrollmentDto);
    }

    // Returns the courses a student is enrolled in
    @GetMapping("/users/{id}/enrollments")
    public List<EnrollmentCourseSummaryDto> getStudentEnrollments(@PathVariable Long id) {
        return enrollmentService.getStudentEnrollments(id);
    }

    // Returns the students enrolled in a given course
    @GetMapping("users/{userId}/courses/{courseId}/enrollments")
    public List<EnrollmentStudentSummaryDto> getCourseEnrollments(
            @PathVariable Long userId,
            @PathVariable Long courseId
    ) {
        return enrollmentService.getCourseEnrollments(userId, courseId);
    }

    // Returns all enrollments
    @GetMapping("/enrollments")
    public List<EnrollmentDto> getAllEnrollments() {
        return enrollmentService.getAllEnrollments();
    }
}
