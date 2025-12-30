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

    // Enrolls a student in a given course
    public EnrollmentDto enrollStudent(Long studentId, Long courseId) {
        // Gets the student from the repository
        User student = userRepository.findById(studentId).orElseThrow(UserNotFoundException::new);

        // Gets the course from the repository
        Course course = courseRepository.findById(courseId).orElseThrow(CourseNotFoundException::new);

        // Checks if the student is already enrolled in the course
        EnrollmentId enrollmentId = new EnrollmentId(studentId, courseId);
        if (enrollmentRepository.existsById(enrollmentId)) {
            throw new StudentAlreadyEnrolledException();
        }

        // Creates a new enrollment
        Enrollment enrollment = new Enrollment();
        enrollment.setId(enrollmentId);
        enrollment.setStudent(student);
        enrollment.setCourse(course);
        enrollmentRepository.save(enrollment);

        // Returns the enrollment
        return enrollmentMapper.toDto(enrollment);
    }

    // Returns the courses a student is enrolled in
    public List<EnrollmentCourseSummaryDto> getStudentEnrollments(Long id) {
        // Checks if the student exists
        if (!userRepository.existsById(id)) {
            throw new UserNotFoundException();
        }

        // Returns the courses' summaries
        return enrollmentRepository.findByIdStudentId(id)
                .stream()
                .map(enrollmentMapper::toCourseSummary)
                .toList();
    }

    // Returns the students enrolled in a given course
    public List<EnrollmentStudentSummaryDto> getCourseEnrollments(Long userId, Long courseId) {
        // Gets the course from the repository
        Course course = courseRepository.findById(courseId).orElseThrow(CourseNotFoundException::new);

        // Checks if the user exists
        if (!userRepository.existsById(userId)) {
            throw new UserNotFoundException();
        }

        // Checks if the user is the course's creator and if the user is enrolled in the course
        if (!Objects.equals(course.getCreatedBy().getId(), userId) && !enrollmentRepository.existsById(new EnrollmentId(userId, courseId))) {
            throw new AccessDeniedException();
        }

        // Returns the students' summaries
        return enrollmentRepository.findByIdCourseId(courseId)
                .stream()
                .map(enrollmentMapper::toStudentSummary)
                .toList();
    }

    // Returns all enrollments
    public List<EnrollmentDto> getAllEnrollments() {
        return enrollmentRepository.findAll()
                .stream()
                .map(enrollmentMapper::toDto)
                .toList();
    }
}
