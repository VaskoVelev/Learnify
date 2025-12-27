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

    @PostMapping("/courses/{id}/enroll")
    public ResponseEntity<?> createEnrollment(@PathVariable Long id) {
        EnrollmentDto enrollmentDto = enrollmentService.createEnrollment(id);
        return ResponseEntity.status(HttpStatus.CREATED).body(enrollmentDto);
    }

    @GetMapping("/me/enrollments")
    public List<EnrollmentCourseSummaryDto> getMyEnrollments() {
        return enrollmentService.getMyEnrollments();
    }

    @GetMapping("/courses/{id}/enrollments")
    public List<EnrollmentStudentSummaryDto> getCourseEnrollments(@PathVariable Long id) {
        return enrollmentService.getCourseEnrollments(id);
    }

    @GetMapping("/admin/enrollments")
    public List<EnrollmentDto> getAllEnrollments() {
        return enrollmentService.getAllEnrollments();
    }
}
