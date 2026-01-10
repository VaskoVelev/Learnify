package com.vvelev.learnify.services;

import com.vvelev.learnify.dtos.enrollment.EnrollmentCourseSummaryDto;
import com.vvelev.learnify.dtos.enrollment.EnrollmentDto;
import com.vvelev.learnify.dtos.enrollment.EnrollmentStudentSummaryDto;
import com.vvelev.learnify.entities.Course;
import com.vvelev.learnify.entities.Enrollment;
import com.vvelev.learnify.entities.EnrollmentId;
import com.vvelev.learnify.entities.User;
import com.vvelev.learnify.exceptions.AccessDeniedException;
import com.vvelev.learnify.exceptions.CourseNotFoundException;
import com.vvelev.learnify.exceptions.StudentAlreadyEnrolledException;
import com.vvelev.learnify.exceptions.UserNotFoundException;
import com.vvelev.learnify.mappers.EnrollmentMapper;
import com.vvelev.learnify.repositories.CourseRepository;
import com.vvelev.learnify.repositories.EnrollmentRepository;
import com.vvelev.learnify.repositories.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;

@AllArgsConstructor
@Service
public class EnrollmentService {
    private final CourseRepository courseRepository;
    private final UserRepository userRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final EnrollmentMapper enrollmentMapper;

    public EnrollmentDto enrollStudent(Long studentId, Long courseId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Long id = (Long) authentication.getPrincipal();

        if (!studentId.equals(id)) {
            throw new AccessDeniedException();
        }

        User student = userRepository.findById(studentId).orElseThrow(UserNotFoundException::new);
        Course course = courseRepository.findById(courseId).orElseThrow(CourseNotFoundException::new);

        EnrollmentId enrollmentId = new EnrollmentId(studentId, courseId);
        if (enrollmentRepository.existsById(enrollmentId)) {
            throw new StudentAlreadyEnrolledException();
        }

        Enrollment enrollment = new Enrollment();
        enrollment.setId(enrollmentId);
        enrollment.setStudent(student);
        enrollment.setCourse(course);
        enrollmentRepository.save(enrollment);

        return enrollmentMapper.toDto(enrollment);
    }

    public List<EnrollmentCourseSummaryDto> getStudentEnrollments(Long id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Long studentId = (Long) authentication.getPrincipal();

        if (!studentId.equals(id)) {
            throw new AccessDeniedException();
        }

        return enrollmentRepository.findByIdStudentId(studentId)
                .stream()
                .map(enrollmentMapper::toCourseSummary)
                .toList();
    }

    public List<EnrollmentStudentSummaryDto> getCourseEnrollments(Long userId, Long courseId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Long id = (Long) authentication.getPrincipal();

        if (!userId.equals(id)) {
            throw new AccessDeniedException();
        }

        Course course = courseRepository.findById(courseId).orElseThrow(CourseNotFoundException::new);

        if (!userRepository.existsById(userId)) {
            throw new UserNotFoundException();
        }

        if (!Objects.equals(course.getCreatedBy().getId(), userId) && !enrollmentRepository.existsById(new EnrollmentId(userId, courseId))) {
            throw new AccessDeniedException();
        }

        return enrollmentRepository.findByIdCourseId(courseId)
                .stream()
                .map(enrollmentMapper::toStudentSummary)
                .toList();
    }

    public List<EnrollmentDto> getAllEnrollments() {
        return enrollmentRepository.findAll()
                .stream()
                .map(enrollmentMapper::toDto)
                .toList();
    }
}
