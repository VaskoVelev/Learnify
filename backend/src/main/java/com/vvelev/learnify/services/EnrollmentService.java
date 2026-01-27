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
import com.vvelev.learnify.utils.SecurityUtils;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@AllArgsConstructor
@Service
public class EnrollmentService {
    private final StudentProgressionService studentProgressionService;
    private final CourseRepository courseRepository;
    private final UserRepository userRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final EnrollmentMapper enrollmentMapper;
    private final SecurityUtils securityUtils;

    public EnrollmentDto enrollInCourse(Long courseId) {
        Course course = getCourseOrThrow(courseId);

        Long studentId = securityUtils.getCurrentUserId();
        if (isStudentEnrolled(studentId, courseId)) {
            throw new StudentAlreadyEnrolledException();
        }

        User student = getUserOrThrow(studentId);

        Enrollment enrollment = new Enrollment();
        enrollment.setId(new EnrollmentId(studentId, courseId));
        enrollment.setStudent(student);
        enrollment.setCourse(course);
        enrollmentRepository.save(enrollment);

        return enrollmentMapper.toDto(enrollment);
    }

    public List<EnrollmentCourseSummaryDto> getMyEnrollments() {
        Long studentId = securityUtils.getCurrentUserId();

        List<Enrollment> enrollments = enrollmentRepository.findByIdStudentId(studentId);
        Map<Long, Double> progressionMap = studentProgressionService.getMyProgressions();

        return enrollments
                .stream()
                .map(enrollment -> {
                    EnrollmentCourseSummaryDto dto = enrollmentMapper.toCourseSummary(enrollment);

                    Double progression = progressionMap.get(enrollment.getCourse().getId());
                    dto.setProgressionPercent(progression != null ? progression : 0.0);

                    return dto;
                })
                .toList();
    }

    public List<EnrollmentStudentSummaryDto> getCourseEnrollments(Long courseId) {
        Course course = getCourseOrThrow(courseId);

        Long userId = securityUtils.getCurrentUserId();
        if (!isCourseCreator(course, userId) && !isStudentEnrolled(userId, courseId)) {
            throw new AccessDeniedException();
        }

        return enrollmentRepository
                .findByIdCourseId(courseId)
                .stream()
                .map(enrollmentMapper::toStudentSummary)
                .toList();
    }

    public List<EnrollmentDto> getAllEnrollments() {
        return enrollmentRepository
                .findAll()
                .stream()
                .map(enrollmentMapper::toDto)
                .toList();
    }

    private Course getCourseOrThrow(Long courseId) {
        return courseRepository
                .findById(courseId)
                .orElseThrow(CourseNotFoundException::new);
    }

    private User getUserOrThrow(Long userId) {
        return userRepository
                .findById(userId)
                .orElseThrow(UserNotFoundException::new);
    }

    private boolean isStudentEnrolled(Long studentId, Long courseId) {
        return enrollmentRepository.existsById(new EnrollmentId(studentId, courseId));
    }

    private boolean isCourseCreator(Course course, Long teacherId) {
        return course.getCreatedBy().getId().equals(teacherId);
    }
}
