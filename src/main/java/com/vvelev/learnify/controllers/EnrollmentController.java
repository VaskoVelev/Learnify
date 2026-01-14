package com.vvelev.learnify.controllers;

import com.vvelev.learnify.dtos.enrollment.EnrollmentCourseSummaryDto;
import com.vvelev.learnify.dtos.enrollment.EnrollmentDto;
import com.vvelev.learnify.dtos.enrollment.EnrollmentStudentSummaryDto;
import com.vvelev.learnify.services.EnrollmentService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@AllArgsConstructor
@RestController
public class EnrollmentController {
    private final EnrollmentService enrollmentService;

    @PreAuthorize("hasRole(Role.STUDENT.name())")
    @PostMapping("/courses/{id}/enroll")
    public ResponseEntity<?> enrollInCourse(@PathVariable Long id) {
        EnrollmentDto enrollmentDto = enrollmentService.enrollInCourse(id);
        return ResponseEntity.status(HttpStatus.CREATED).body(enrollmentDto);
    }

    @PreAuthorize("hasRole(Role.STUDENT.name())")
    @GetMapping("/enrollments/me")
    public List<EnrollmentCourseSummaryDto> getMyEnrollments() {
        return enrollmentService.getMyEnrollments();
    }

    @PreAuthorize("hasAnyRole(Role.TEACHER.name(), Role.STUDENT.name())")
    @GetMapping("courses/{id}/enrollments")
    public List<EnrollmentStudentSummaryDto> getCourseEnrollments(@PathVariable Long id) {
        return enrollmentService.getCourseEnrollments(id);
    }

    @PreAuthorize("Role.ADMIN.name()")
    @GetMapping("/enrollments")
    public List<EnrollmentDto> getAllEnrollments() {
        return enrollmentService.getAllEnrollments();
    }
}
