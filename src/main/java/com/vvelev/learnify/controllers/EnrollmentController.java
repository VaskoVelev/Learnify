package com.vvelev.learnify.controllers;

import com.vvelev.learnify.dtos.enrollment.EnrollmentDto;
import com.vvelev.learnify.entities.Course;
import com.vvelev.learnify.entities.Enrollment;
import com.vvelev.learnify.entities.EnrollmentId;
import com.vvelev.learnify.entities.User;
import com.vvelev.learnify.exceptions.CourseNotFoundException;
import com.vvelev.learnify.exceptions.StudentAlreadyEnrolledException;
import com.vvelev.learnify.exceptions.UserNotFoundException;
import com.vvelev.learnify.mappers.EnrollmentMapper;
import com.vvelev.learnify.repositories.CourseRepository;
import com.vvelev.learnify.repositories.EnrollmentRepository;
import com.vvelev.learnify.repositories.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.util.UriComponentsBuilder;

@AllArgsConstructor
@RestController
public class EnrollmentController {
    private CourseRepository courseRepository;
    private UserRepository userRepository;
    private EnrollmentRepository enrollmentRepository;
    private EnrollmentMapper enrollmentMapper;

    @PostMapping("/courses/{id}/enroll")
    public ResponseEntity<?> createEnrollment(
            @PathVariable Long id,
            UriComponentsBuilder uriBuilder
    ) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Long studentId = (Long) authentication.getPrincipal();

        User student = userRepository.findById(studentId).orElse(null);
        if (student == null) {
            throw new UserNotFoundException();
        }

        Course course = courseRepository.findById(id).orElse(null);
        if (course == null) {
            throw new CourseNotFoundException();
        }

        EnrollmentId enrollmentId = new EnrollmentId(studentId, id);
        if (enrollmentRepository.existsById(enrollmentId)) {
            throw new StudentAlreadyEnrolledException();
        }

        Enrollment enrollment = new Enrollment();
        enrollment.setId(enrollmentId);
        enrollment.setStudent(student);
        enrollment.setCourse(course);

        enrollmentRepository.save(enrollment);

        EnrollmentDto enrollmentDto = enrollmentMapper.toDto(enrollment);
        return ResponseEntity.status(HttpStatus.CREATED).body(enrollmentDto);
    }
}
