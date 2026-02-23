package com.vvelev.learnify.controllers;

import com.vvelev.learnify.constants.ApiPaths;
import com.vvelev.learnify.dtos.enrollment.EnrollmentCourseSummaryDto;
import com.vvelev.learnify.dtos.enrollment.EnrollmentDto;
import com.vvelev.learnify.dtos.enrollment.EnrollmentStudentSummaryDto;
import com.vvelev.learnify.services.EnrollmentService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@AllArgsConstructor
@RestController
public class EnrollmentController {
    private final EnrollmentService enrollmentService;

    @PostMapping(ApiPaths.COURSE_ENROLL)
    public ResponseEntity<?> enrollInCourse(@PathVariable Long id) {
        EnrollmentDto enrollmentDto = enrollmentService.enrollInCourse(id);
        return ResponseEntity.status(HttpStatus.CREATED).body(enrollmentDto);
    }

    @GetMapping(ApiPaths.ENROLLMENTS_ME)
    public List<EnrollmentCourseSummaryDto> getMyEnrollments() {
        return enrollmentService.getMyEnrollments();
    }

    @GetMapping(ApiPaths.COURSE_ENROLLMENTS)
    public List<EnrollmentStudentSummaryDto> getCourseEnrollments(@PathVariable Long id) {
        return enrollmentService.getCourseEnrollments(id);
    }

    @GetMapping(ApiPaths.ENROLLMENTS)
    public List<EnrollmentDto> getAllEnrollments() {
        return enrollmentService.getAllEnrollments();
    }

    @DeleteMapping(ApiPaths.ENROLLMENT_BY_ID)
    public ResponseEntity<Void> deleteEnrollment(
            @PathVariable Long studentId,
            @PathVariable Long courseId
    ) {
        enrollmentService.deleteEnrollment(studentId, courseId);
        return ResponseEntity.noContent().build();
    }
}
