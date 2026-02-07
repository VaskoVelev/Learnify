package com.vvelev.learnify.services;

import com.vvelev.learnify.dtos.studentprogression.StudentProgressionDto;
import com.vvelev.learnify.entities.*;
import com.vvelev.learnify.exceptions.AccessDeniedException;
import com.vvelev.learnify.exceptions.CourseNotFoundException;
import com.vvelev.learnify.exceptions.StudentProgressionNotFoundException;
import com.vvelev.learnify.mappers.StudentProgressionMapper;
import com.vvelev.learnify.repositories.*;
import com.vvelev.learnify.utils.SecurityUtils;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class StudentProgressionServiceTest {
    @Mock private StudentProgressionRepository studentProgressionRepository;
    @Mock private SubmissionRepository submissionRepository;
    @Mock private QuizRepository quizRepository;
    @Mock private CourseRepository courseRepository;
    @Mock private EnrollmentRepository enrollmentRepository;
    @Mock private StudentProgressionMapper studentProgressionMapper;
    @Mock private SecurityUtils securityUtils;

    @InjectMocks
    private StudentProgressionService studentProgressionService;

    private User teacher;
    private User student;
    private Course course;
    private StudentProgression progression;
    private StudentProgressionDto progressionDto;

    @BeforeEach
    void setUp() {
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

        course = new Course();
        course.setId(1L);
        course.setTitle("Test Course");
        course.setDescription("Course Description");
        course.setCategory(Category.IT);
        course.setDifficulty(Difficulty.ADVANCED);
        course.setThumbnail("/uploads/thumbnail.jpg");
        course.setCreatedBy(teacher);

        progression = new StudentProgression();
        progression.setId(1L);
        progression.setStudent(student);
        progression.setCourse(course);
        progression.setProgressionPercent(50.0);
        progression.setAverageScore(85.5);

        progressionDto = new StudentProgressionDto(1L, 50.0, 85.5, student.getId(), course.getId());
    }

    /* -------------------- Update Progression -------------------- */

    @Test
    void updateProgression_ShouldUpdateProgression() {
        long totalQuizzes = 5L;
        long submittedQuizzes = 3L;
        Double averageScore = 80.0;

        when(studentProgressionRepository.findByStudentIdAndCourseId(student.getId(), course.getId()))
                .thenReturn(Optional.of(progression));
        when(quizRepository.countByLessonCourseId(course.getId())).thenReturn(totalQuizzes);
        when(submissionRepository.countDistinctQuizByStudentIdAndCourseId(student.getId(), course.getId()))
                .thenReturn(submittedQuizzes);
        when(submissionRepository.findAverageScoreByStudentIdAndCourseId(student.getId(), course.getId()))
                .thenReturn(averageScore);
        when(studentProgressionRepository.save(progression)).thenReturn(progression);

        studentProgressionService.updateProgression(student, course);

        assertEquals(60.0, progression.getProgressionPercent(), 0.01);
        assertEquals(80.0, progression.getAverageScore(), 0.01);

        verify(studentProgressionRepository, times(1))
                .findByStudentIdAndCourseId(student.getId(), course.getId());
        verify(quizRepository, times(1)).countByLessonCourseId(course.getId());
        verify(submissionRepository, times(1))
                .countDistinctQuizByStudentIdAndCourseId(student.getId(), course.getId());
        verify(submissionRepository, times(1))
                .findAverageScoreByStudentIdAndCourseId(student.getId(), course.getId());
        verify(studentProgressionRepository, times(1)).save(progression);
    }

    @Test
    void updateProgression_ShouldCreateNewProgression_WhenNotExists() {
        long totalQuizzes = 4L;
        long submittedQuizzes = 1L;
        Double averageScore = 75.0;

        when(studentProgressionRepository.findByStudentIdAndCourseId(student.getId(), course.getId()))
                .thenReturn(Optional.empty());
        when(quizRepository.countByLessonCourseId(course.getId())).thenReturn(totalQuizzes);
        when(submissionRepository.countDistinctQuizByStudentIdAndCourseId(student.getId(), course.getId()))
                .thenReturn(submittedQuizzes);
        when(submissionRepository.findAverageScoreByStudentIdAndCourseId(student.getId(), course.getId()))
                .thenReturn(averageScore);
        when(studentProgressionRepository.save(any(StudentProgression.class)))
                .thenAnswer(invocation -> {
                    StudentProgression savedProgression = invocation.getArgument(0);
                    savedProgression.setId(2L);
                    return savedProgression;
                });

        studentProgressionService.updateProgression(student, course);

        verify(studentProgressionRepository, times(1)).save(argThat(p ->
                p.getStudent().equals(student) &&
                        p.getCourse().equals(course) &&
                        p.getProgressionPercent() == 25.0 &&
                        p.getAverageScore() == 75.0
        ));
        verify(studentProgressionRepository, times(1))
                .findByStudentIdAndCourseId(student.getId(), course.getId());
        verify(quizRepository, times(1)).countByLessonCourseId(course.getId());
        verify(submissionRepository, times(1))
                .countDistinctQuizByStudentIdAndCourseId(student.getId(), course.getId());
        verify(submissionRepository, times(1))
                .findAverageScoreByStudentIdAndCourseId(student.getId(), course.getId());
    }

    @Test
    void updateProgression_ShouldHandleZeroTotalQuizzes() {
        long totalQuizzes = 0L;
        long submittedQuizzes = 0L;

        when(studentProgressionRepository.findByStudentIdAndCourseId(student.getId(), course.getId()))
                .thenReturn(Optional.of(progression));
        when(quizRepository.countByLessonCourseId(course.getId())).thenReturn(totalQuizzes);
        when(submissionRepository.countDistinctQuizByStudentIdAndCourseId(student.getId(), course.getId()))
                .thenReturn(submittedQuizzes);
        when(submissionRepository.findAverageScoreByStudentIdAndCourseId(student.getId(), course.getId()))
                .thenReturn(null);
        when(studentProgressionRepository.save(progression)).thenReturn(progression);

        studentProgressionService.updateProgression(student, course);

        assertEquals(0.0, progression.getProgressionPercent(), 0.01);
        assertEquals(0.0, progression.getAverageScore(), 0.01);

        verify(quizRepository, times(1)).countByLessonCourseId(course.getId());
        verify(submissionRepository, times(1))
                .countDistinctQuizByStudentIdAndCourseId(student.getId(), course.getId());
        verify(submissionRepository, times(1))
                .findAverageScoreByStudentIdAndCourseId(student.getId(), course.getId());
        verify(studentProgressionRepository, times(1)).save(progression);
    }

    @Test
    void updateProgression_ShouldHandleAllQuizzesSubmitted() {
        long totalQuizzes = 3L;
        long submittedQuizzes = 3L;
        Double averageScore = 95.5;

        when(studentProgressionRepository.findByStudentIdAndCourseId(student.getId(), course.getId()))
                .thenReturn(Optional.of(progression));
        when(quizRepository.countByLessonCourseId(course.getId())).thenReturn(totalQuizzes);
        when(submissionRepository.countDistinctQuizByStudentIdAndCourseId(student.getId(), course.getId()))
                .thenReturn(submittedQuizzes);
        when(submissionRepository.findAverageScoreByStudentIdAndCourseId(student.getId(), course.getId()))
                .thenReturn(averageScore);
        when(studentProgressionRepository.save(progression)).thenReturn(progression);

        studentProgressionService.updateProgression(student, course);

        assertEquals(100.0, progression.getProgressionPercent(), 0.01);
        assertEquals(95.5, progression.getAverageScore(), 0.01);

        verify(quizRepository, times(1)).countByLessonCourseId(course.getId());
        verify(submissionRepository, times(1))
                .countDistinctQuizByStudentIdAndCourseId(student.getId(), course.getId());
        verify(submissionRepository, times(1))
                .findAverageScoreByStudentIdAndCourseId(student.getId(), course.getId());
        verify(studentProgressionRepository, times(1)).save(progression);
    }

    /* -------------------- Get My Progression -------------------- */

    @Test
    void getMyProgression_ShouldReturnMyProgression_WhenUserIsEnrolledInCourse() {
        when(courseRepository.existsById(course.getId())).thenReturn(true);
        when(securityUtils.getCurrentUserId()).thenReturn(student.getId());
        when(enrollmentRepository.existsById(any(EnrollmentId.class))).thenReturn(true);
        when(studentProgressionRepository.findByStudentIdAndCourseId(student.getId(), course.getId()))
                .thenReturn(Optional.of(progression));
        when(studentProgressionMapper.toDto(progression)).thenReturn(progressionDto);

        StudentProgressionDto result = studentProgressionService.getMyProgression(course.getId());

        assertNotNull(result);
        assertEquals(progressionDto.getId(), result.getId());
        assertEquals(progressionDto.getProgressionPercent(), result.getProgressionPercent());
        assertEquals(progressionDto.getAverageScore(), result.getAverageScore());
        assertEquals(progressionDto.getStudentId(), result.getStudentId());
        assertEquals(progressionDto.getCourseId(), result.getCourseId());

        verify(courseRepository, times(1)).existsById(course.getId());
        verify(securityUtils, times(1)).getCurrentUserId();
        verify(enrollmentRepository, times(1)).existsById(any(EnrollmentId.class));
        verify(studentProgressionRepository, times(1))
                .findByStudentIdAndCourseId(student.getId(), course.getId());
        verify(studentProgressionMapper, times(1)).toDto(progression);
    }

    @Test
    void getMyProgression_ShouldThrowCourseNotFoundException_WhenCourseNotFound() {
        Long nonExistentCourseId = 999L;
        when(courseRepository.existsById(nonExistentCourseId)).thenReturn(false);

        assertThrows(
                CourseNotFoundException.class,
                () -> studentProgressionService.getMyProgression(nonExistentCourseId)
        );

        verify(courseRepository, times(1)).existsById(nonExistentCourseId);
        verifyNoInteractions(securityUtils, enrollmentRepository, studentProgressionRepository, studentProgressionMapper);
    }

    @Test
    void getMyProgression_ShouldThrowAccessDeniedException_WhenUserIsNotEnrolledInCourse() {
        when(courseRepository.existsById(course.getId())).thenReturn(true);
        when(securityUtils.getCurrentUserId()).thenReturn(teacher.getId());
        when(enrollmentRepository.existsById(any(EnrollmentId.class))).thenReturn(false);

        assertThrows(
                AccessDeniedException.class,
                () -> studentProgressionService.getMyProgression(course.getId())
        );

        verify(courseRepository, times(1)).existsById(course.getId());
        verify(securityUtils, times(1)).getCurrentUserId();
        verify(enrollmentRepository, times(1)).existsById(any(EnrollmentId.class));
        verifyNoInteractions(studentProgressionRepository, studentProgressionMapper);
    }

    @Test
    void getMyProgression_ShouldThrowStudentProgressionNotFoundException_WhenProgressionNotFound() {
        when(courseRepository.existsById(course.getId())).thenReturn(true);
        when(securityUtils.getCurrentUserId()).thenReturn(student.getId());
        when(enrollmentRepository.existsById(any(EnrollmentId.class))).thenReturn(true);
        when(studentProgressionRepository.findByStudentIdAndCourseId(student.getId(), course.getId()))
                .thenReturn(Optional.empty());

        assertThrows(
                StudentProgressionNotFoundException.class,
                () -> studentProgressionService.getMyProgression(course.getId())
        );

        verify(courseRepository, times(1)).existsById(course.getId());
        verify(securityUtils, times(1)).getCurrentUserId();
        verify(enrollmentRepository, times(1)).existsById(any(EnrollmentId.class));
        verify(studentProgressionRepository, times(1))
                .findByStudentIdAndCourseId(student.getId(), course.getId());
        verifyNoInteractions(studentProgressionMapper);
    }

    /* -------------------- Get Course Progressions -------------------- */

    @Test
    void getCourseProgressions_ShouldReturnCourseProgressions_WhenUserIsCourseCreator() {
        when(courseRepository.findById(course.getId())).thenReturn(Optional.of(course));
        when(securityUtils.getCurrentUserId()).thenReturn(teacher.getId());
        when(studentProgressionRepository.findByCourseId(course.getId())).thenReturn(List.of(progression));
        when(studentProgressionMapper.toDto(progression)).thenReturn(progressionDto);

        List<StudentProgressionDto> result = studentProgressionService.getCourseProgressions(course.getId());

        assertNotNull(result);
        assertEquals(progressionDto.getId(), result.get(0).getId());
        assertEquals(progressionDto.getProgressionPercent(), result.get(0).getProgressionPercent());
        assertEquals(progressionDto.getAverageScore(), result.get(0).getAverageScore());
        assertEquals(progressionDto.getStudentId(), result.get(0).getStudentId());
        assertEquals(progressionDto.getCourseId(), result.get(0).getCourseId());

        verify(courseRepository, times(1)).findById(course.getId());
        verify(securityUtils, times(1)).getCurrentUserId();
        verify(studentProgressionRepository, times(1)).findByCourseId(course.getId());
        verify(studentProgressionMapper, times(1)).toDto(progression);
    }

    @Test
    void getCourseProgressions_ShouldThrowCourseNotFoundException_WhenCourseNotFound() {
        Long nonExistentCourseId = 999L;
        when(courseRepository.findById(nonExistentCourseId)).thenReturn(Optional.empty());

        assertThrows(
                CourseNotFoundException.class,
                () -> studentProgressionService.getCourseProgressions(nonExistentCourseId)
        );

        verify(courseRepository, times(1)).findById(nonExistentCourseId);
        verifyNoInteractions(securityUtils, studentProgressionRepository, studentProgressionMapper);
    }

    @Test
    void getCourseProgressions_ShouldThrowAccessDeniedException_WhenUserIsNotCourseCreator() {
        when(courseRepository.findById(course.getId())).thenReturn(Optional.of(course));
        when(securityUtils.getCurrentUserId()).thenReturn(student.getId());

        assertThrows(
                AccessDeniedException.class,
                () -> studentProgressionService.getCourseProgressions(course.getId())
        );

        verify(courseRepository, times(1)).findById(course.getId());
        verify(securityUtils, times(1)).getCurrentUserId();
        verifyNoInteractions(studentProgressionRepository, studentProgressionMapper);
    }

    @Test
    void getCourseProgressions_ShouldReturnEmptyList_WhenNoProgressionsExist() {
        when(courseRepository.findById(course.getId())).thenReturn(Optional.of(course));
        when(securityUtils.getCurrentUserId()).thenReturn(teacher.getId());
        when(studentProgressionRepository.findByCourseId(course.getId())).thenReturn(List.of());

        List<StudentProgressionDto> result = studentProgressionService.getCourseProgressions(course.getId());

        assertNotNull(result);
        assertTrue(result.isEmpty());

        verify(courseRepository, times(1)).findById(course.getId());
        verify(securityUtils, times(1)).getCurrentUserId();
        verify(studentProgressionRepository, times(1)).findByCourseId(course.getId());
        verify(studentProgressionMapper, never()).toDto(progression);
    }
}
