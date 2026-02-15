package com.vvelev.learnify.services;

import com.vvelev.learnify.dtos.question.CreateQuestionDto;
import com.vvelev.learnify.dtos.question.QuestionDto;
import com.vvelev.learnify.dtos.question.UpdateQuestionDto;
import com.vvelev.learnify.entities.*;
import com.vvelev.learnify.exceptions.AccessDeniedException;
import com.vvelev.learnify.exceptions.QuestionNotFoundException;
import com.vvelev.learnify.exceptions.QuizNotFoundException;
import com.vvelev.learnify.mappers.QuestionMapper;
import com.vvelev.learnify.repositories.EnrollmentRepository;
import com.vvelev.learnify.repositories.QuestionRepository;
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
public class QuestionServiceTest {
    @Mock private QuestionRepository questionRepository;
    @Mock private QuizRepository quizRepository;
    @Mock private EnrollmentRepository enrollmentRepository;
    @Mock private QuestionMapper questionMapper;
    @Mock private SecurityUtils securityUtils;

    @InjectMocks
    private QuestionService questionService;

    private Quiz quiz;
    private User teacher;
    private User student;
    private Question question;
    private CreateQuestionDto createQuestionDto;
    private UpdateQuestionDto updateQuestionDto;
    private QuestionDto questionDto;

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

        Lesson lesson = new Lesson();
        lesson.setId(1L);
        lesson.setTitle("Test Lesson");
        lesson.setCourse(course);

        quiz = new Quiz();
        quiz.setId(1L);
        quiz.setTitle("Test Quiz");
        quiz.setLesson(lesson);

        question = new Question();
        question.setId(1L);
        question.setText("Test Question Text");
        question.setQuiz(quiz);

        createQuestionDto = new CreateQuestionDto("New Question Text");
        updateQuestionDto = new UpdateQuestionDto("Updated Question Text");
        questionDto = new QuestionDto(1L, "Test Question Text", 1L);
    }

    /* -------------------- Create Question -------------------- */

    @Test
    void createQuestion_ShouldCreateQuestion_WhenUserIsCourseCreator() {
        when(quizRepository.findById(quiz.getId())).thenReturn(Optional.of(quiz));
        when(securityUtils.getCurrentUserId()).thenReturn(teacher.getId());
        when(questionMapper.toEntity(createQuestionDto)).thenReturn(question);
        when(questionRepository.save(question)).thenReturn(question);
        when(questionMapper.toDto(question)).thenReturn(questionDto);

        QuestionDto result = questionService.createQuestion(quiz.getId(), createQuestionDto);

        assertNotNull(result);
        assertEquals(questionDto.getId(), result.getId());
        assertEquals(questionDto.getText(), result.getText());
        assertEquals(questionDto.getQuizId(), result.getQuizId());

        assertEquals(quiz, question.getQuiz());

        verify(quizRepository, times(1)).findById(quiz.getId());
        verify(securityUtils, times(1)).getCurrentUserId();
        verify(questionMapper, times(1)).toEntity(createQuestionDto);
        verify(questionRepository, times(1)).save(question);
        verify(questionMapper, times(1)).toDto(question);
    }

    @Test
    void createQuestion_ShouldThrowQuizNotFoundException_WhenQuizNotFound() {
        Long nonExistentQuizId = 999L;
        when(quizRepository.findById(nonExistentQuizId)).thenReturn(Optional.empty());

        assertThrows(
                QuizNotFoundException.class,
                () -> questionService.createQuestion(nonExistentQuizId, createQuestionDto)
        );

        verify(quizRepository, times(1)).findById(nonExistentQuizId);
        verifyNoInteractions(securityUtils, questionMapper, questionRepository);
    }

    @Test
    void createQuestion_ShouldThrowAccessDeniedException_WhenUserIsNotCourseCreator() {
        when(quizRepository.findById(quiz.getId())).thenReturn(Optional.of(quiz));
        when(securityUtils.getCurrentUserId()).thenReturn(student.getId());

        assertThrows(
                AccessDeniedException.class,
                () -> questionService.createQuestion(quiz.getId(), createQuestionDto)
        );

        verify(quizRepository, times(1)).findById(quiz.getId());
        verify(securityUtils, times(1)).getCurrentUserId();
        verifyNoInteractions(questionMapper, questionRepository);
    }

    /* -------------------- Get Quiz Questions -------------------- */

    @Test
    void getQuizQuestions_ShouldReturnQuizQuestions_WhenUserIsCourseCreator() {
        when(quizRepository.findById(quiz.getId())).thenReturn(Optional.of(quiz));
        when(securityUtils.getCurrentUserId()).thenReturn(teacher.getId());
        when(questionRepository.findByQuizIdOrderById(quiz.getId())).thenReturn(List.of(question));
        when(questionMapper.toDto(question)).thenReturn(questionDto);

        List<QuestionDto> result = questionService.getQuizQuestions(quiz.getId());

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(questionDto.getId(), result.get(0).getId());
        assertEquals(questionDto.getText(), result.get(0).getText());
        assertEquals(questionDto.getQuizId(), result.get(0).getQuizId());

        verify(quizRepository, times(1)).findById(quiz.getId());
        verify(securityUtils, times(1)).getCurrentUserId();
        verify(questionRepository, times(1)).findByQuizIdOrderById(quiz.getId());
        verify(questionMapper, times(1)).toDto(question);
        verify(enrollmentRepository, never()).existsById(any(EnrollmentId.class));
    }

    @Test
    void getQuizQuestions_ShouldReturnQuizQuestions_WhenUserIsEnrolledInCourse() {
        when(quizRepository.findById(quiz.getId())).thenReturn(Optional.of(quiz));
        when(securityUtils.getCurrentUserId()).thenReturn(student.getId());
        when(enrollmentRepository.existsById(any(EnrollmentId.class))).thenReturn(true);
        when(questionRepository.findByQuizIdOrderById(quiz.getId())).thenReturn(List.of(question));
        when(questionMapper.toDto(question)).thenReturn(questionDto);

        List<QuestionDto> result = questionService.getQuizQuestions(quiz.getId());

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(questionDto.getId(), result.get(0).getId());
        assertEquals(questionDto.getText(), result.get(0).getText());
        assertEquals(questionDto.getQuizId(), result.get(0).getQuizId());

        verify(quizRepository, times(1)).findById(quiz.getId());
        verify(securityUtils, times(1)).getCurrentUserId();
        verify(enrollmentRepository, times(1)).existsById(any(EnrollmentId.class));
        verify(questionRepository, times(1)).findByQuizIdOrderById(quiz.getId());
        verify(questionMapper, times(1)).toDto(question);
    }

    @Test
    void getQuizQuestions_ShouldThrowQuizNotFoundException_WhenQuizNotFound() {
        Long nonExistentQuizId = 999L;
        when(quizRepository.findById(nonExistentQuizId)).thenReturn(Optional.empty());

        assertThrows(
                QuizNotFoundException.class,
                () -> questionService.getQuizQuestions(nonExistentQuizId)
        );

        verify(quizRepository, times(1)).findById(nonExistentQuizId);
        verifyNoInteractions(securityUtils, enrollmentRepository, questionRepository, questionMapper);
    }

    @Test
    void getQuizQuestions_ShouldThrowAccessDeniedException_WhenUserIsNotAuthorized() {
        User unauthorizedUser = new User();
        unauthorizedUser.setId(3L);

        when(quizRepository.findById(quiz.getId())).thenReturn(Optional.of(quiz));
        when(securityUtils.getCurrentUserId()).thenReturn(unauthorizedUser.getId());
        when(enrollmentRepository.existsById(any(EnrollmentId.class))).thenReturn(false);

        assertThrows(
                AccessDeniedException.class,
                () -> questionService.getQuizQuestions(quiz.getId())
        );

        verify(quizRepository, times(1)).findById(quiz.getId());
        verify(securityUtils, times(1)).getCurrentUserId();
        verify(enrollmentRepository, times(1)).existsById(any(EnrollmentId.class));
        verifyNoInteractions(questionRepository, questionMapper);
    }

    @Test
    void getQuizQuestions_ShouldReturnEmptyList_WhenNoQuestionsExist() {
        when(quizRepository.findById(quiz.getId())).thenReturn(Optional.of(quiz));
        when(securityUtils.getCurrentUserId()).thenReturn(teacher.getId());
        when(questionRepository.findByQuizIdOrderById(quiz.getId())).thenReturn(List.of());

        List<QuestionDto> result = questionService.getQuizQuestions(quiz.getId());

        assertNotNull(result);
        assertTrue(result.isEmpty());

        verify(quizRepository, times(1)).findById(quiz.getId());
        verify(securityUtils, times(1)).getCurrentUserId();
        verify(questionRepository, times(1)).findByQuizIdOrderById(quiz.getId());
        verify(questionMapper, never()).toDto(any(Question.class));
    }

    /* -------------------- Update Question -------------------- */

    @Test
    void updateQuestion_ShouldUpdateQuestion_WhenUserIsCourseCreator() {
        when(questionRepository.findById(question.getId())).thenReturn(Optional.of(question));
        when(securityUtils.getCurrentUserId()).thenReturn(teacher.getId());
        doNothing().when(questionMapper).update(eq(updateQuestionDto), any(Question.class));
        when(questionRepository.save(question)).thenReturn(question);
        when(questionMapper.toDto(question)).thenReturn(questionDto);

        QuestionDto result = questionService.updateQuestion(question.getId(), updateQuestionDto);

        assertNotNull(result);
        assertEquals(questionDto.getId(), result.getId());
        assertEquals(questionDto.getText(), result.getText());
        assertEquals(questionDto.getQuizId(), result.getId());

        verify(questionRepository, times(1)).findById(question.getId());
        verify(securityUtils, times(1)).getCurrentUserId();
        verify(questionMapper, times(1)).update(updateQuestionDto, question);
        verify(questionRepository, times(1)).save(question);
        verify(questionMapper, times(1)).toDto(question);
    }

    @Test
    void updateQuestion_ShouldThrowQuestionNotFoundException_WhenQuestionNotFound() {
        Long nonExistentQuestionId = 999L;
        when(questionRepository.findById(nonExistentQuestionId)).thenReturn(Optional.empty());

        assertThrows(
                QuestionNotFoundException.class,
                () -> questionService.updateQuestion(nonExistentQuestionId, updateQuestionDto)
        );

        verify(questionRepository, times(1)).findById(nonExistentQuestionId);
        verifyNoInteractions(securityUtils, questionMapper);
    }

    @Test
    void updateQuestion_ShouldThrowAccessDeniedException_WhenUserIsNotCourseCreator() {
        when(questionRepository.findById(question.getId())).thenReturn(Optional.of(question));
        when(securityUtils.getCurrentUserId()).thenReturn(student.getId());

        assertThrows(
                AccessDeniedException.class,
                () -> questionService.updateQuestion(question.getId(), updateQuestionDto)
        );

        verify(questionRepository, times(1)).findById(question.getId());
        verify(securityUtils, times(1)).getCurrentUserId();
        verifyNoInteractions(questionMapper);
    }

    /* -------------------- Delete Question -------------------- */

    @Test
    void deleteQuestion_ShouldDeleteQuestion_WhenUserIsCourseCreator() {
        when(questionRepository.findById(question.getId())).thenReturn(Optional.of(question));
        when(securityUtils.getCurrentUserId()).thenReturn(teacher.getId());
        doNothing().when(questionRepository).delete(question);

        questionService.deleteQuestion(question.getId());

        verify(questionRepository, times(1)).findById(question.getId());
        verify(securityUtils, times(1)).getCurrentUserId();
        verify(questionRepository, times(1)).delete(question);
    }

    @Test
    void deleteQuestion_ShouldThrowQuestionNotFoundException_WhenQuestionNotFound() {
        Long nonExistentQuestionId = 999L;
        when(questionRepository.findById(nonExistentQuestionId)).thenReturn(Optional.empty());

        assertThrows(
                QuestionNotFoundException.class,
                () -> questionService.deleteQuestion(nonExistentQuestionId)
        );

        verify(questionRepository, times(1)).findById(nonExistentQuestionId);
        verifyNoInteractions(securityUtils);
    }

    @Test
    void deleteQuestion_ShouldThrowAccessDeniedException_WhenUserIsNotCourseCreator() {
        when(questionRepository.findById(question.getId())).thenReturn(Optional.of(question));
        when(securityUtils.getCurrentUserId()).thenReturn(student.getId());

        assertThrows(
                AccessDeniedException.class,
                () -> questionService.deleteQuestion(question.getId())
        );

        verify(questionRepository, times(1)).findById(question.getId());
        verify(securityUtils, times(1)).getCurrentUserId();
        verify(questionRepository, never()).delete(any(Question.class));
    }
}
