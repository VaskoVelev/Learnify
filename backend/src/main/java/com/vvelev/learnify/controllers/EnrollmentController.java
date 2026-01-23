package com.vvelev.learnify.controllers;

import com.vvelev.learnify.constants.ApiPaths;
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
    @PostMapping(ApiPaths.COURSE_ENROLL)
    public ResponseEntity<?> enrollInCourse(@PathVariable Long id) {
        EnrollmentDto enrollmentDto = enrollmentService.enrollInCourse(id);
        return ResponseEntity.status(HttpStatus.CREATED).body(enrollmentDto);
    }

    @PreAuthorize("hasRole(Role.STUDENT.name())")
    @GetMapping(ApiPaths.ENROLLMENTS_ME)
    public List<EnrollmentCourseSummaryDto> getMyEnrollments() {
        return enrollmentService.getMyEnrollments();
    }

    @PreAuthorize("hasAnyRole(Role.TEACHER.name(), Role.STUDENT.name())")
    @GetMapping(ApiPaths.COURSE_ENROLLMENTS)
    public List<EnrollmentStudentSummaryDto> getCourseEnrollments(@PathVariable Long id) {
        return enrollmentService.getCourseEnrollments(id);
    }

    @PreAuthorize("Role.ADMIN.name()")
    @GetMapping(ApiPaths.ENROLLMENTS)
    public List<EnrollmentDto> getAllEnrollments() {
        return enrollmentService.getAllEnrollments();
    }
}
