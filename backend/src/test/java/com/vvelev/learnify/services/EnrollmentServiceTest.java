package com.vvelev.learnify.services;

import com.vvelev.learnify.dtos.enrollment.EnrollmentCourseSummaryDto;
import com.vvelev.learnify.dtos.enrollment.EnrollmentDto;
import com.vvelev.learnify.dtos.enrollment.EnrollmentStudentSummaryDto;
import com.vvelev.learnify.entities.*;
import com.vvelev.learnify.exceptions.AccessDeniedException;
import com.vvelev.learnify.exceptions.CourseNotFoundException;
import com.vvelev.learnify.exceptions.StudentAlreadyEnrolledException;
import com.vvelev.learnify.mappers.EnrollmentMapper;
import com.vvelev.learnify.repositories.CourseRepository;
import com.vvelev.learnify.repositories.EnrollmentRepository;
import com.vvelev.learnify.repositories.UserRepository;
import com.vvelev.learnify.utils.SecurityUtils;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class EnrollmentServiceTest {
    @Mock private CourseRepository courseRepository;
    @Mock private UserRepository userRepository;
    @Mock private EnrollmentRepository enrollmentRepository;
    @Mock private EnrollmentMapper enrollmentMapper;
    @Mock private SecurityUtils securityUtils;

    @InjectMocks
    private EnrollmentService enrollmentService;

    private User teacher;
    private User student;
    private Course course;
    private EnrollmentId enrollmentId;
    private Enrollment enrollment;
    private EnrollmentDto enrollmentDto;
    private EnrollmentCourseSummaryDto courseSummaryDto;
    private EnrollmentStudentSummaryDto studentSummaryDto;

    @BeforeEach
    void setup() {
        teacher = new User();
        teacher.setId(1L);
        teacher.setEmail("teacher@example.com");
        teacher.setFirstName("John");
        teacher.setLastName("Doe");
        teacher.setRole(Role.TEACHER);

        student = new User();
        student.setId(2L);
        student.setEmail("student@example.com");
        student.setFirstName("Jane");
        student.setLastName("Smith");
        student.setRole(Role.STUDENT);

        LocalDateTime now = LocalDateTime.now();
        LocalDateTime earlier = now.minusDays(1);

        course = new Course();
        course.setId(1L);
        course.setTitle("Test Course");
        course.setDescription("Course Description");
        course.setCategory(Category.IT);
        course.setDifficulty(Difficulty.ADVANCED);
        course.setThumbnail("/uploads/thumbnail.jpg");
        course.setCreatedBy(teacher);
        course.setCreatedAt(earlier);
        course.setUpdatedAt(now);

        enrollmentId = new EnrollmentId(student.getId(), course.getId());

        enrollment = new Enrollment();
        enrollment.setId(enrollmentId);
        enrollment.setStudent(student);
        enrollment.setCourse(course);
        enrollment.setEnrolledAt(earlier);

        enrollmentDto = new EnrollmentDto(
                student.getId(),
                student.getFirstName(),
                student.getLastName(),
                course.getId(),
                course.getTitle(),
                teacher.getId(),
                teacher.getFirstName(),
                teacher.getLastName(),
                earlier
        );

        courseSummaryDto = new EnrollmentCourseSummaryDto(
                course.getId(),
                course.getTitle(),
                teacher.getId(),
                teacher.getFirstName(),
                teacher.getLastName(),
                earlier
        );

        studentSummaryDto = new EnrollmentStudentSummaryDto(
                student.getId(),
                student.getFirstName(),
                student.getLastName(),
                earlier
        );
    }

    /* -------------------- Enroll In Course -------------------- */

    @Test
    void enrollInCourse_ShouldEnrollStudent_WhenStudentNotAlreadyEnrolled() {
        when(courseRepository.findById(course.getId())).thenReturn(Optional.of(course));
        when(securityUtils.getCurrentUserId()).thenReturn(student.getId());
        when(enrollmentRepository.existsById(enrollmentId)).thenReturn(false);
        when(userRepository.findById(student.getId())).thenReturn(Optional.of(student));

        when(enrollmentRepository.save(any(Enrollment.class))).thenAnswer(invocation -> {
            Enrollment savedEnrollment = invocation.getArgument(0);
            savedEnrollment.setId(enrollmentId);
            savedEnrollment.setStudent(student);
            savedEnrollment.setCourse(course);
            savedEnrollment.setEnrolledAt(enrollment.getEnrolledAt());
            return savedEnrollment;
        });

        when(enrollmentMapper.toDto(any(Enrollment.class))).thenReturn(enrollmentDto);

        EnrollmentDto result = enrollmentService.enrollInCourse(course.getId());

        assertNotNull(result);
        assertEquals(enrollmentDto.getStudentId(), result.getStudentId());
        assertEquals(enrollmentDto.getStudentFirstName(), result.getStudentFirstName());
        assertEquals(enrollmentDto.getStudentLastName(), result.getStudentLastName());
        assertEquals(enrollmentDto.getCourseId(), result.getCourseId());
        assertEquals(enrollmentDto.getTitle(), result.getTitle());
        assertEquals(enrollmentDto.getTeacherId(), result.getTeacherId());
        assertEquals(enrollmentDto.getTeacherFirstName(), result.getTeacherFirstName());
        assertEquals(enrollmentDto.getTeacherLastName(), result.getTeacherLastName());
        assertEquals(enrollmentDto.getEnrolledAt(), result.getEnrolledAt());

        verify(courseRepository, times(1)).findById(course.getId());
        verify(securityUtils, times(1)).getCurrentUserId();
        verify(enrollmentRepository, times(1)).existsById(enrollmentId);
        verify(userRepository, times(1)).findById(student.getId());
        verify(enrollmentRepository, times(1)).save(any(Enrollment.class));
        verify(enrollmentMapper, times(1)).toDto(any(Enrollment.class));
    }

    @Test
    void enrollInCourse_ShouldThrowCourseNotFoundException_WhenCourseNotFound() {
        Long nonExistentCourseId = 999L;
        when(courseRepository.findById(nonExistentCourseId)).thenReturn(Optional.empty());

        assertThrows(
                CourseNotFoundException.class,
                () -> enrollmentService.enrollInCourse(nonExistentCourseId)
        );

        verify(courseRepository, times(1)).findById(nonExistentCourseId);
        verifyNoInteractions(securityUtils, enrollmentRepository, userRepository, enrollmentMapper);
    }

    @Test
    void enrollInCourse_ShouldThrowStudentAlreadyEnrolledException_WhenStudentAlreadyEnrolled() {
        when(courseRepository.findById(course.getId())).thenReturn(Optional.of(course));
        when(securityUtils.getCurrentUserId()).thenReturn(student.getId());
        when(enrollmentRepository.existsById(enrollmentId)).thenReturn(true);

        assertThrows(
                StudentAlreadyEnrolledException.class,
                () -> enrollmentService.enrollInCourse(course.getId())
        );

        verify(courseRepository, times(1)).findById(course.getId());
        verify(securityUtils, times(1)).getCurrentUserId();
        verify(enrollmentRepository, times(1)).existsById(enrollmentId);
        verifyNoInteractions(userRepository, enrollmentMapper);
    }

    /* -------------------- Get My Enrollments -------------------- */

    @Test
    void getMyEnrollments_ShouldReturnMyEnrollments_WhenStudentHasEnrollments() {
        when(securityUtils.getCurrentUserId()).thenReturn(student.getId());
        when(enrollmentRepository.findByIdStudentId(student.getId())).thenReturn(List.of(enrollment));
        when(enrollmentMapper.toCourseSummary(enrollment)).thenReturn(courseSummaryDto);

        List<EnrollmentCourseSummaryDto> result = enrollmentService.getMyEnrollments();

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(courseSummaryDto.getId(), result.get(0).getId());
        assertEquals(courseSummaryDto.getTitle(), result.get(0).getTitle());
        assertEquals(courseSummaryDto.getTeacherId(), result.get(0).getTeacherId());
        assertEquals(courseSummaryDto.getFirstName(), result.get(0).getFirstName());
        assertEquals(courseSummaryDto.getLastName(), result.get(0).getLastName());
        assertEquals(courseSummaryDto.getEnrolledAt(), result.get(0).getEnrolledAt());

        verify(securityUtils, times(1)).getCurrentUserId();
        verify(enrollmentRepository, times(1)).findByIdStudentId(student.getId());
        verify(enrollmentMapper, times(1)).toCourseSummary(enrollment);
    }

    @Test
    void getMyEnrollments_ShouldReturnEmptyList_WhenStudentHasNoEnrollments() {
        when(securityUtils.getCurrentUserId()).thenReturn(student.getId());
        when(enrollmentRepository.findByIdStudentId(student.getId())).thenReturn(List.of());

        List<EnrollmentCourseSummaryDto> result = enrollmentService.getMyEnrollments();

        assertNotNull(result);
        assertTrue(result.isEmpty());

        verify(securityUtils, times(1)).getCurrentUserId();
        verify(enrollmentRepository, times(1)).findByIdStudentId(student.getId());
        verify(enrollmentMapper, never()).toCourseSummary(any(Enrollment.class));
    }

    /* -------------------- Get Course Enrollments -------------------- */

    @Test
    void getCourseEnrollments_ShouldReturnCourseEnrollments_WhenUserIsCourseCreator() {
        when(courseRepository.findById(course.getId())).thenReturn(Optional.of(course));
        when(securityUtils.getCurrentUserId()).thenReturn(teacher.getId());
        when(enrollmentRepository.findByIdCourseId(course.getId())).thenReturn(List.of(enrollment));
        when(enrollmentMapper.toStudentSummary(enrollment)).thenReturn(studentSummaryDto);

        List<EnrollmentStudentSummaryDto> result = enrollmentService.getCourseEnrollments(course.getId());

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(studentSummaryDto.getId(), result.get(0).getId());
        assertEquals(studentSummaryDto.getFirstName(), result.get(0).getFirstName());
        assertEquals(studentSummaryDto.getLastName(), result.get(0).getLastName());
        assertEquals(studentSummaryDto.getEnrolledAt(), result.get(0).getEnrolledAt());

        verify(courseRepository, times(1)).findById(course.getId());
        verify(securityUtils, times(1)).getCurrentUserId();
        verify(enrollmentRepository, times(1)).findByIdCourseId(course.getId());
        verify(enrollmentMapper, times(1)).toStudentSummary(enrollment);
        verify(enrollmentRepository, never()).existsById(any(EnrollmentId.class));
    }

    @Test
    void getCourseEnrollments_ShouldReturnCourseEnrollments_WhenUserIsEnrolledInCourse() {
        when(courseRepository.findById(course.getId())).thenReturn(Optional.of(course));
        when(securityUtils.getCurrentUserId()).thenReturn(student.getId());
        when(enrollmentRepository.existsById(any(EnrollmentId.class))).thenReturn(true);
        when(enrollmentRepository.findByIdCourseId(course.getId())).thenReturn(List.of(enrollment));
        when(enrollmentMapper.toStudentSummary(enrollment)).thenReturn(studentSummaryDto);

        List<EnrollmentStudentSummaryDto> result = enrollmentService.getCourseEnrollments(course.getId());

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(studentSummaryDto.getId(), result.get(0).getId());
        assertEquals(studentSummaryDto.getFirstName(), result.get(0).getFirstName());
        assertEquals(studentSummaryDto.getLastName(), result.get(0).getLastName());
        assertEquals(studentSummaryDto.getEnrolledAt(), result.get(0).getEnrolledAt());

        verify(courseRepository, times(1)).findById(course.getId());
        verify(securityUtils, times(1)).getCurrentUserId();
        verify(enrollmentRepository, times(1)).existsById(any(EnrollmentId.class));
        verify(enrollmentRepository, times(1)).findByIdCourseId(course.getId());
        verify(enrollmentMapper, times(1)).toStudentSummary(enrollment);
    }

    @Test
    void getCourseEnrollments_ShouldThrowCourseNotFoundException_WhenCourseNotFound() {
        Long nonExistentCourseId = 999L;
        when(courseRepository.findById(nonExistentCourseId)).thenReturn(Optional.empty());

        assertThrows(
                CourseNotFoundException.class,
                () -> enrollmentService.getCourseEnrollments(nonExistentCourseId)
        );

        verify(courseRepository, times(1)).findById(nonExistentCourseId);
        verifyNoInteractions(securityUtils, enrollmentRepository, enrollmentMapper);
    }

    @Test
    void getCourseEnrollments_ShouldThrowAccessDeniedException_WhenUserIsNotAuthorized() {
        User unauthorizedUser = new User();
        unauthorizedUser.setId(3L);

        when(courseRepository.findById(course.getId())).thenReturn(Optional.of(course));
        when(securityUtils.getCurrentUserId()).thenReturn(unauthorizedUser.getId());
        when(enrollmentRepository.existsById(any(EnrollmentId.class))).thenReturn(false);

        assertThrows(
                AccessDeniedException.class,
                () -> enrollmentService.getCourseEnrollments(course.getId())
        );

        verify(courseRepository, times(1)).findById(course.getId());
        verify(securityUtils, times(1)).getCurrentUserId();
        verify(enrollmentRepository, times(1)).existsById(any(EnrollmentId.class));
        verifyNoMoreInteractions(enrollmentRepository);
        verifyNoInteractions(enrollmentMapper);
    }

    @Test
    void getCourseEnrollments_ShouldReturnEmptyList_WhenCourseHasNoEnrollments() {
        when(courseRepository.findById(course.getId())).thenReturn(Optional.of(course));
        when(securityUtils.getCurrentUserId()).thenReturn(teacher.getId());
        when(enrollmentRepository.findByIdCourseId(course.getId())).thenReturn(List.of());

        List<EnrollmentStudentSummaryDto> result = enrollmentService.getCourseEnrollments(course.getId());

        assertNotNull(result);
        assertTrue(result.isEmpty());

        verify(courseRepository, times(1)).findById(course.getId());
        verify(securityUtils, times(1)).getCurrentUserId();
        verify(enrollmentRepository, times(1)).findByIdCourseId(course.getId());
        verify(enrollmentMapper, never()).toStudentSummary(any(Enrollment.class));
    }

    /* -------------------- Get All Enrollments -------------------- */

    @Test
    void getAllEnrollments_ShouldReturnAllEnrollments_WhenCalled() {
        when(enrollmentRepository.findAll()).thenReturn(List.of(enrollment));
        when(enrollmentMapper.toDto(enrollment)).thenReturn(enrollmentDto);

        List<EnrollmentDto> result = enrollmentService.getAllEnrollments();

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(enrollmentDto.getStudentId(), result.get(0).getStudentId());
        assertEquals(enrollmentDto.getStudentFirstName(), result.get(0).getStudentFirstName());
        assertEquals(enrollmentDto.getStudentLastName(), result.get(0).getStudentLastName());
        assertEquals(enrollmentDto.getCourseId(), result.get(0).getCourseId());
        assertEquals(enrollmentDto.getTitle(), result.get(0).getTitle());
        assertEquals(enrollmentDto.getTeacherId(), result.get(0).getTeacherId());
        assertEquals(enrollmentDto.getTeacherFirstName(), result.get(0).getTeacherFirstName());
        assertEquals(enrollmentDto.getTeacherLastName(), result.get(0).getTeacherLastName());
        assertEquals(enrollmentDto.getEnrolledAt(), result.get(0).getEnrolledAt());

        verify(enrollmentRepository, times(1)).findAll();
        verify(enrollmentMapper, times(1)).toDto(enrollment);
    }

    @Test
    void getAllEnrollments_ShouldReturnEmptyList_WhenNoEnrollmentsExist() {
        when(enrollmentRepository.findAll()).thenReturn(List.of());

        List<EnrollmentDto> result = enrollmentService.getAllEnrollments();

        assertNotNull(result);
        assertTrue(result.isEmpty());

        verify(enrollmentRepository, times(1)).findAll();
        verify(enrollmentMapper, never()).toDto(any(Enrollment.class));
    }
}
