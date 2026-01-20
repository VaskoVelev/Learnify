package com.vvelev.learnify.services;

import com.vvelev.learnify.dtos.quiz.CreateQuizDto;
import com.vvelev.learnify.dtos.quiz.QuizDto;
import com.vvelev.learnify.dtos.quiz.UpdateQuizDto;
import com.vvelev.learnify.entities.*;
import com.vvelev.learnify.exceptions.AccessDeniedException;
import com.vvelev.learnify.exceptions.CourseNotFoundException;
import com.vvelev.learnify.exceptions.QuizNotFoundException;
import com.vvelev.learnify.mappers.QuizMapper;
import com.vvelev.learnify.repositories.CourseRepository;
import com.vvelev.learnify.repositories.EnrollmentRepository;
import com.vvelev.learnify.repositories.QuizRepository;
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
public class QuizServiceTest {
    @Mock private QuizRepository quizRepository;
    @Mock private CourseRepository courseRepository;
    @Mock private EnrollmentRepository enrollmentRepository;
    @Mock private QuizMapper quizMapper;
    @Mock private SecurityUtils securityUtils;

    @InjectMocks
    private QuizService quizService;

    private Course course;
    private User teacher;
    private User student;
    private Quiz quiz;
    private CreateQuizDto createQuizDto;
    private UpdateQuizDto updateQuizDto;
    private QuizDto quizDto;

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
        course.setCreatedBy(teacher);

        quiz = new Quiz();
        quiz.setId(1L);
        quiz.setTitle("Test Quiz");
        quiz.setDescription("Quiz Description");
        quiz.setCourse(course);

        createQuizDto = new CreateQuizDto("New Quiz", "New Quiz Description");
        updateQuizDto = new UpdateQuizDto("Updated Quiz", "Updated Quiz Description");
        quizDto = new QuizDto(1L, "Test Quiz", "Quiz Description", 1L);
    }

    /* -------------------- Create Quiz -------------------- */

    @Test
    void createQuiz_ShouldCreateQuiz_WhenUserIsCourseCreator() {
        when(courseRepository.findById(course.getId())).thenReturn(Optional.of(course));
        when(securityUtils.getCurrentUserId()).thenReturn(teacher.getId());
        when(quizMapper.toEntity(createQuizDto)).thenReturn(quiz);
        when(quizRepository.save(quiz)).thenReturn(quiz);
        when(quizMapper.toDto(quiz)).thenReturn(quizDto);

        QuizDto result = quizService.createQuiz(course.getId(), createQuizDto);

        assertNotNull(result);
        assertEquals(quizDto.getId(), result.getId());
        assertEquals(quizDto.getTitle(), result.getTitle());
        assertEquals(quizDto.getDescription(), result.getDescription());
        assertEquals(quizDto.getCourseId(), result.getCourseId());

        assertEquals(course, quiz.getCourse());

        verify(courseRepository, times(1)).findById(course.getId());
        verify(securityUtils, times(1)).getCurrentUserId();
        verify(quizMapper, times(1)).toEntity(createQuizDto);
        verify(quizRepository, times(1)).save(quiz);
        verify(quizMapper, times(1)).toDto(quiz);
    }

    @Test
    void createQuiz_ShouldThrowCourseNotFoundException_WhenCourseNotFound() {
        Long nonExistentCourseId = 999L;
        when(courseRepository.findById(nonExistentCourseId)).thenReturn(Optional.empty());

        assertThrows(
                CourseNotFoundException.class,
                () -> quizService.createQuiz(nonExistentCourseId, createQuizDto)
        );

        verify(courseRepository, times(1)).findById(nonExistentCourseId);
        verifyNoInteractions(securityUtils, quizMapper, quizRepository);
    }

    @Test
    void createQuiz_ShouldThrowAccessDeniedException_WhenUserIsNotCourseCreator() {
        when(courseRepository.findById(course.getId())).thenReturn(Optional.of(course));
        when(securityUtils.getCurrentUserId()).thenReturn(student.getId());

        assertThrows(
                AccessDeniedException.class,
                () -> quizService.createQuiz(course.getId(), createQuizDto)
        );

        verify(courseRepository, times(1)).findById(course.getId());
        verify(securityUtils, times(1)).getCurrentUserId();
        verifyNoInteractions(quizMapper, quizRepository);
    }

    /* -------------------- Get Course Quizzes -------------------- */

    @Test
    void getCourseQuizzes_ShouldReturnCourseQuizzes_WhenUserIsCourseCreator() {
        when(courseRepository.findById(course.getId())).thenReturn(Optional.of(course));
        when(securityUtils.getCurrentUserId()).thenReturn(teacher.getId());
        when(quizRepository.findByCourseId(course.getId())).thenReturn(List.of(quiz));
        when(quizMapper.toDto(quiz)).thenReturn(quizDto);

        List<QuizDto> result = quizService.getCourseQuizzes(course.getId());

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(quizDto.getId(), result.get(0).getId());
        assertEquals(quizDto.getTitle(), result.get(0).getTitle());
        assertEquals(quizDto.getDescription(), result.get(0).getDescription());
        assertEquals(quizDto.getCourseId(), result.get(0).getCourseId());

        verify(courseRepository, times(1)).findById(course.getId());
        verify(securityUtils, times(1)).getCurrentUserId();
        verify(quizRepository, times(1)).findByCourseId(course.getId());
        verify(quizMapper, times(1)).toDto(quiz);
        verify(enrollmentRepository, never()).existsById(any(EnrollmentId.class));
    }

    @Test
    void getCourseQuizzes_ShouldReturnCourseQuizzes_WhenUserIsEnrolledInCourse() {
        when(courseRepository.findById(course.getId())).thenReturn(Optional.of(course));
        when(securityUtils.getCurrentUserId()).thenReturn(student.getId());
        when(enrollmentRepository.existsById(any(EnrollmentId.class))).thenReturn(true);
        when(quizRepository.findByCourseId(course.getId())).thenReturn(List.of(quiz));
        when(quizMapper.toDto(quiz)).thenReturn(quizDto);

        List<QuizDto> result = quizService.getCourseQuizzes(course.getId());

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(quizDto.getId(), result.get(0).getId());
        assertEquals(quizDto.getTitle(), result.get(0).getTitle());
        assertEquals(quizDto.getDescription(), result.get(0).getDescription());
        assertEquals(quizDto.getCourseId(), result.get(0).getCourseId());

        verify(courseRepository, times(1)).findById(course.getId());
        verify(securityUtils, times(1)).getCurrentUserId();
        verify(enrollmentRepository, times(1)).existsById(any(EnrollmentId.class));
        verify(quizRepository, times(1)).findByCourseId(course.getId());
        verify(quizMapper, times(1)).toDto(quiz);
    }

    @Test
    void getCourseQuizzes_ShouldThrowCourseNotFoundException_WhenCourseNotFound() {
        Long nonExistentCourseId = 999L;
        when(courseRepository.findById(nonExistentCourseId)).thenReturn(Optional.empty());

        assertThrows(
                CourseNotFoundException.class,
                () -> quizService.getCourseQuizzes(nonExistentCourseId)
        );

        verify(courseRepository, times(1)).findById(nonExistentCourseId);
        verifyNoInteractions(securityUtils, enrollmentRepository, quizRepository, quizMapper);
    }

    @Test
    void getCourseQuizzes_ShouldThrowAccessDeniedException_WhenUserIsNotAuthorized() {
        User unauthorizedUser = new User();
        unauthorizedUser.setId(3L);

        when(courseRepository.findById(course.getId())).thenReturn(Optional.of(course));
        when(securityUtils.getCurrentUserId()).thenReturn(unauthorizedUser.getId());
        when(enrollmentRepository.existsById(any(EnrollmentId.class))).thenReturn(false);

        assertThrows(
                AccessDeniedException.class,
                () -> quizService.getCourseQuizzes(course.getId())
        );

        verify(courseRepository, times(1)).findById(course.getId());
        verify(securityUtils, times(1)).getCurrentUserId();
        verify(enrollmentRepository, times(1)).existsById(any(EnrollmentId.class));
        verifyNoInteractions(quizRepository, quizMapper);
    }

    @Test
    void getCourseQuizzes_ShouldReturnEmptyList_WhenNoQuizzesExist() {
        when(courseRepository.findById(course.getId())).thenReturn(Optional.of(course));
        when(securityUtils.getCurrentUserId()).thenReturn(teacher.getId());
        when(quizRepository.findByCourseId(course.getId())).thenReturn(List.of());

        List<QuizDto> result = quizService.getCourseQuizzes(course.getId());

        assertNotNull(result);
        assertTrue(result.isEmpty());

        verify(courseRepository, times(1)).findById(course.getId());
        verify(securityUtils, times(1)).getCurrentUserId();
        verify(quizRepository, times(1)).findByCourseId(course.getId());
        verify(quizMapper, never()).toDto(any(Quiz.class));
    }

    /* -------------------- Get Quiz -------------------- */

    @Test
    void getQuiz_ShouldReturnQuiz_WhenUserIsCourseCreator() {
        when(quizRepository.findById(quiz.getId())).thenReturn(Optional.of(quiz));
        when(securityUtils.getCurrentUserId()).thenReturn(teacher.getId());
        when(quizMapper.toDto(quiz)).thenReturn(quizDto);

        QuizDto result = quizService.getQuiz(quiz.getId());

        assertNotNull(result);
        assertEquals(quizDto.getId(), result.getId());
        assertEquals(quizDto.getTitle(), result.getTitle());
        assertEquals(quizDto.getDescription(), result.getDescription());
        assertEquals(quizDto.getCourseId(), result.getCourseId());

        verify(quizRepository, times(1)).findById(quiz.getId());
        verify(securityUtils, times(1)).getCurrentUserId();
        verify(quizMapper, times(1)).toDto(quiz);
        verify(enrollmentRepository, never()).existsById(any(EnrollmentId.class));
    }

    @Test
    void getQuiz_ShouldReturnQuiz_WhenUserIsEnrolledInCourse() {
        when(quizRepository.findById(quiz.getId())).thenReturn(Optional.of(quiz));
        when(securityUtils.getCurrentUserId()).thenReturn(student.getId());
        when(enrollmentRepository.existsById(any(EnrollmentId.class))).thenReturn(true);
        when(quizMapper.toDto(quiz)).thenReturn(quizDto);

        QuizDto result = quizService.getQuiz(quiz.getId());

        assertNotNull(result);
        assertEquals(quizDto.getId(), result.getId());
        assertEquals(quizDto.getTitle(), result.getTitle());
        assertEquals(quizDto.getDescription(), result.getDescription());
        assertEquals(quizDto.getCourseId(), result.getCourseId());

        verify(quizRepository, times(1)).findById(quiz.getId());
        verify(securityUtils, times(1)).getCurrentUserId();
        verify(enrollmentRepository, times(1)).existsById(any(EnrollmentId.class));
        verify(quizMapper, times(1)).toDto(quiz);
    }

    @Test
    void getQuiz_ShouldThrowQuizNotFoundException_WhenQuizNotFound() {
        Long nonExistentQuizId = 999L;
        when(quizRepository.findById(nonExistentQuizId)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(
                QuizNotFoundException.class,
                () -> quizService.getQuiz(nonExistentQuizId)
        );

        verify(quizRepository, times(1)).findById(nonExistentQuizId);
        verifyNoInteractions(securityUtils, enrollmentRepository, quizMapper);
    }

    @Test
    void getQuiz_ShouldThrowAccessDeniedException_WhenUserIsNotAuthorized() {
        User unauthorizedUser = new User();
        unauthorizedUser.setId(3L);

        when(quizRepository.findById(quiz.getId())).thenReturn(Optional.of(quiz));
        when(securityUtils.getCurrentUserId()).thenReturn(unauthorizedUser.getId());
        when(enrollmentRepository.existsById(any(EnrollmentId.class))).thenReturn(false);

        assertThrows(
                AccessDeniedException.class,
                () -> quizService.getQuiz(quiz.getId())
        );

        verify(quizRepository, times(1)).findById(quiz.getId());
        verify(securityUtils, times(1)).getCurrentUserId();
        verify(enrollmentRepository, times(1)).existsById(any(EnrollmentId.class));
        verifyNoInteractions(quizMapper);
    }

    /* -------------------- Update Quiz -------------------- */

    @Test
    void updateQuiz_ShouldUpdateQuiz_WhenUserIsCourseCreator() {
        when(quizRepository.findById(quiz.getId())).thenReturn(Optional.of(quiz));
        when(securityUtils.getCurrentUserId()).thenReturn(teacher.getId());
        doNothing().when(quizMapper).update(eq(updateQuizDto), any(Quiz.class));
        when(quizRepository.save(quiz)).thenReturn(quiz);
        when(quizMapper.toDto(quiz)).thenReturn(quizDto);

        QuizDto result = quizService.updateQuiz(quiz.getId(), updateQuizDto);

        assertNotNull(result);
        assertEquals(quizDto.getId(), result.getId());
        assertEquals(quizDto.getTitle(), result.getTitle());
        assertEquals(quizDto.getDescription(), result.getDescription());
        assertEquals(quizDto.getCourseId(), result.getCourseId());

        verify(quizRepository, times(1)).findById(quiz.getId());
        verify(securityUtils, times(1)).getCurrentUserId();
        verify(quizMapper, times(1)).update(updateQuizDto, quiz);
        verify(quizRepository, times(1)).save(quiz);
        verify(quizMapper, times(1)).toDto(quiz);
    }

    @Test
    void updateQuiz_ShouldThrowQuizNotFoundException_WhenQuizNotFound() {
        Long nonExistentQuizId = 999L;
        when(quizRepository.findById(nonExistentQuizId)).thenReturn(Optional.empty());

        assertThrows(
                QuizNotFoundException.class,
                () -> quizService.updateQuiz(nonExistentQuizId, updateQuizDto)
        );

        verify(quizRepository, times(1)).findById(nonExistentQuizId);
        verifyNoInteractions(securityUtils, quizMapper);
    }

    @Test
    void updateQuiz_ShouldThrowAccessDeniedException_WhenUserIsNotCourseCreator() {
        when(quizRepository.findById(quiz.getId())).thenReturn(Optional.of(quiz));
        when(securityUtils.getCurrentUserId()).thenReturn(student.getId());

        assertThrows(
                AccessDeniedException.class,
                () -> quizService.updateQuiz(quiz.getId(), updateQuizDto)
        );

        verify(quizRepository, times(1)).findById(quiz.getId());
        verify(securityUtils, times(1)).getCurrentUserId();
        verifyNoInteractions(quizMapper);
    }

    /* -------------------- Delete Quiz -------------------- */

    @Test
    void deleteQuiz_ShouldDeleteQuiz_WhenUserIsCourseCreator() {
        when(quizRepository.findById(quiz.getId())).thenReturn(Optional.of(quiz));
        when(securityUtils.getCurrentUserId()).thenReturn(teacher.getId());
        doNothing().when(quizRepository).delete(quiz);

        quizService.deleteQuiz(quiz.getId());

        verify(quizRepository, times(1)).findById(quiz.getId());
        verify(securityUtils, times(1)).getCurrentUserId();
        verify(quizRepository, times(1)).delete(quiz);
    }

    @Test
    void deleteQuiz_ShouldThrowQuizNotFoundException_WhenQuizNotFound() {
        Long nonExistentQuizId = 999L;
        when(quizRepository.findById(nonExistentQuizId)).thenReturn(Optional.empty());

        assertThrows(
                QuizNotFoundException.class,
                () -> quizService.deleteQuiz(nonExistentQuizId)
        );

        verify(quizRepository, times(1)).findById(nonExistentQuizId);
        verifyNoInteractions(securityUtils);
    }

    @Test
    void deleteQuiz_ShouldThrowAccessDeniedException_WhenUserIsNotCourseCreator() {
        when(quizRepository.findById(quiz.getId())).thenReturn(Optional.of(quiz));
        when(securityUtils.getCurrentUserId()).thenReturn(student.getId());

        assertThrows(
                AccessDeniedException.class,
                () -> quizService.deleteQuiz(quiz.getId())
        );

        verify(quizRepository, times(1)).findById(quiz.getId());
        verify(securityUtils, times(1)).getCurrentUserId();
        verify(quizRepository, never()).delete(any(Quiz.class));
    }
}
