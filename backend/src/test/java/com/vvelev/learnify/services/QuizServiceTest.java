package com.vvelev.learnify.services;

import com.vvelev.learnify.dtos.quiz.CreateQuizDto;
import com.vvelev.learnify.dtos.quiz.QuizDto;
import com.vvelev.learnify.dtos.quiz.UpdateQuizDto;
import com.vvelev.learnify.entities.*;
import com.vvelev.learnify.exceptions.AccessDeniedException;
import com.vvelev.learnify.exceptions.LessonNotFoundException;
import com.vvelev.learnify.exceptions.QuizNotFoundException;
import com.vvelev.learnify.mappers.QuizMapper;
import com.vvelev.learnify.repositories.EnrollmentRepository;
import com.vvelev.learnify.repositories.LessonRepository;
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
    @Mock private LessonRepository lessonRepository;
    @Mock private EnrollmentRepository enrollmentRepository;
    @Mock private QuizMapper quizMapper;
    @Mock private SecurityUtils securityUtils;

    @InjectMocks
    private QuizService quizService;

    private Lesson lesson;
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

        Course course = new Course();
        course.setId(1L);
        course.setTitle("Test Course");
        course.setDescription("Course Description");
        course.setCreatedBy(teacher);

        lesson = new Lesson();
        lesson.setId(1L);
        lesson.setTitle("Test Lesson");
        lesson.setCourse(course);

        quiz = new Quiz();
        quiz.setId(1L);
        quiz.setTitle("Test Quiz");
        quiz.setDescription("Quiz Description");
        quiz.setLesson(lesson);

        createQuizDto = new CreateQuizDto("New Quiz", "New Quiz Description");
        updateQuizDto = new UpdateQuizDto("Updated Quiz", "Updated Quiz Description");
        quizDto = new QuizDto(1L, "Test Quiz", "Quiz Description", 1L);
    }

    /* -------------------- Create Quiz -------------------- */

    @Test
    void createQuiz_ShouldCreateQuiz_WhenUserIsCourseCreator() {
        when(lessonRepository.findById(lesson.getId())).thenReturn(Optional.of(lesson));
        when(securityUtils.getCurrentUserId()).thenReturn(teacher.getId());
        when(quizMapper.toEntity(createQuizDto)).thenReturn(quiz);
        when(quizRepository.save(quiz)).thenReturn(quiz);
        when(quizMapper.toDto(quiz)).thenReturn(quizDto);

        QuizDto result = quizService.createQuiz(lesson.getId(), createQuizDto);

        assertNotNull(result);
        assertEquals(quizDto.getId(), result.getId());
        assertEquals(quizDto.getTitle(), result.getTitle());
        assertEquals(quizDto.getDescription(), result.getDescription());
        assertEquals(quizDto.getLessonId(), result.getLessonId());

        assertEquals(lesson, quiz.getLesson());

        verify(lessonRepository, times(1)).findById(lesson.getId());
        verify(securityUtils, times(1)).getCurrentUserId();
        verify(quizMapper, times(1)).toEntity(createQuizDto);
        verify(quizRepository, times(1)).save(quiz);
        verify(quizMapper, times(1)).toDto(quiz);
    }

    @Test
    void createQuiz_ShouldThrowLessonNotFoundException_WhenLessonNotFound() {
        Long nonExistentLessonId = 999L;
        when(lessonRepository.findById(nonExistentLessonId)).thenReturn(Optional.empty());

        assertThrows(
                LessonNotFoundException.class,
                () -> quizService.createQuiz(nonExistentLessonId, createQuizDto)
        );

        verify(lessonRepository, times(1)).findById(nonExistentLessonId);
        verifyNoInteractions(securityUtils, quizMapper, quizRepository);
    }

    @Test
    void createQuiz_ShouldThrowAccessDeniedException_WhenUserIsNotCourseCreator() {
        when(lessonRepository.findById(lesson.getId())).thenReturn(Optional.of(lesson));
        when(securityUtils.getCurrentUserId()).thenReturn(student.getId());

        assertThrows(
                AccessDeniedException.class,
                () -> quizService.createQuiz(lesson.getId(), createQuizDto)
        );

        verify(lessonRepository, times(1)).findById(lesson.getId());
        verify(securityUtils, times(1)).getCurrentUserId();
        verifyNoInteractions(quizMapper, quizRepository);
    }

    /* -------------------- Get Lesson Quizzes -------------------- */

    @Test
    void getLessonQuizzes_ShouldReturnCourseQuizzes_WhenUserIsCourseCreator() {
        when(lessonRepository.findById(lesson.getId())).thenReturn(Optional.of(lesson));
        when(securityUtils.getCurrentUserId()).thenReturn(teacher.getId());
        when(quizRepository.findByLessonIdOrderById(lesson.getId())).thenReturn(List.of(quiz));
        when(quizMapper.toDto(quiz)).thenReturn(quizDto);

        List<QuizDto> result = quizService.getLessonQuizzes(lesson.getId());

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(quizDto.getId(), result.get(0).getId());
        assertEquals(quizDto.getTitle(), result.get(0).getTitle());
        assertEquals(quizDto.getDescription(), result.get(0).getDescription());
        assertEquals(quizDto.getLessonId(), result.get(0).getLessonId());

        verify(lessonRepository, times(1)).findById(lesson.getId());
        verify(securityUtils, times(1)).getCurrentUserId();
        verify(quizRepository, times(1)).findByLessonIdOrderById(lesson.getId());
        verify(quizMapper, times(1)).toDto(quiz);
        verify(enrollmentRepository, never()).existsById(any(EnrollmentId.class));
    }

    @Test
    void getLessonQuizzes_ShouldReturnCourseQuizzes_WhenUserIsEnrolledInCourse() {
        when(lessonRepository.findById(lesson.getId())).thenReturn(Optional.of(lesson));
        when(securityUtils.getCurrentUserId()).thenReturn(student.getId());
        when(enrollmentRepository.existsById(any(EnrollmentId.class))).thenReturn(true);
        when(quizRepository.findByLessonIdOrderById(lesson.getId())).thenReturn(List.of(quiz));
        when(quizMapper.toDto(quiz)).thenReturn(quizDto);

        List<QuizDto> result = quizService.getLessonQuizzes(lesson.getId());

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(quizDto.getId(), result.get(0).getId());
        assertEquals(quizDto.getTitle(), result.get(0).getTitle());
        assertEquals(quizDto.getDescription(), result.get(0).getDescription());
        assertEquals(quizDto.getLessonId(), result.get(0).getLessonId());

        verify(lessonRepository, times(1)).findById(lesson.getId());
        verify(securityUtils, times(1)).getCurrentUserId();
        verify(enrollmentRepository, times(1)).existsById(any(EnrollmentId.class));
        verify(quizRepository, times(1)).findByLessonIdOrderById(lesson.getId());
        verify(quizMapper, times(1)).toDto(quiz);
    }

    @Test
    void getLessonQuizzes_ShouldThrowLessonNotFoundException_WhenLessonNotFound() {
        Long nonExistentLessonId = 999L;
        when(lessonRepository.findById(nonExistentLessonId)).thenReturn(Optional.empty());

        assertThrows(
                LessonNotFoundException.class,
                () -> quizService.getLessonQuizzes(nonExistentLessonId)
        );

        verify(lessonRepository, times(1)).findById(nonExistentLessonId);
        verifyNoInteractions(securityUtils, enrollmentRepository, quizRepository, quizMapper);
    }

    @Test
    void getLessonQuizzes_ShouldThrowAccessDeniedException_WhenUserIsNotAuthorized() {
        User unauthorizedUser = new User();
        unauthorizedUser.setId(3L);

        when(lessonRepository.findById(lesson.getId())).thenReturn(Optional.of(lesson));
        when(securityUtils.getCurrentUserId()).thenReturn(unauthorizedUser.getId());
        when(enrollmentRepository.existsById(any(EnrollmentId.class))).thenReturn(false);

        assertThrows(
                AccessDeniedException.class,
                () -> quizService.getLessonQuizzes(lesson.getId())
        );

        verify(lessonRepository, times(1)).findById(lesson.getId());
        verify(securityUtils, times(1)).getCurrentUserId();
        verify(enrollmentRepository, times(1)).existsById(any(EnrollmentId.class));
        verifyNoInteractions(quizRepository, quizMapper);
    }

    @Test
    void getLessonQuizzes_ShouldReturnEmptyList_WhenNoQuizzesExist() {
        when(lessonRepository.findById(lesson.getId())).thenReturn(Optional.of(lesson));
        when(securityUtils.getCurrentUserId()).thenReturn(teacher.getId());
        when(quizRepository.findByLessonIdOrderById(lesson.getId())).thenReturn(List.of());

        List<QuizDto> result = quizService.getLessonQuizzes(lesson.getId());

        assertNotNull(result);
        assertTrue(result.isEmpty());

        verify(lessonRepository, times(1)).findById(lesson.getId());
        verify(securityUtils, times(1)).getCurrentUserId();
        verify(quizRepository, times(1)).findByLessonIdOrderById(lesson.getId());
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
        assertEquals(quizDto.getLessonId(), result.getLessonId());

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
        assertEquals(quizDto.getLessonId(), result.getLessonId());

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
        assertEquals(quizDto.getLessonId(), result.getLessonId());

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
