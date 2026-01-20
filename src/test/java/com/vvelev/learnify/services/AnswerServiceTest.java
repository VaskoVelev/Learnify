package com.vvelev.learnify.services;

import com.vvelev.learnify.dtos.answer.CreateAnswerDto;
import com.vvelev.learnify.dtos.answer.StudentAnswerDto;
import com.vvelev.learnify.dtos.answer.TeacherAnswerDto;
import com.vvelev.learnify.dtos.answer.UpdateAnswerDto;
import com.vvelev.learnify.entities.*;
import com.vvelev.learnify.exceptions.AccessDeniedException;
import com.vvelev.learnify.exceptions.AnswerNotFoundException;
import com.vvelev.learnify.exceptions.QuestionNotFoundException;
import com.vvelev.learnify.mappers.AnswerMapper;
import com.vvelev.learnify.repositories.AnswerRepository;
import com.vvelev.learnify.repositories.EnrollmentRepository;
import com.vvelev.learnify.repositories.QuestionRepository;
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
public class AnswerServiceTest {
    @Mock private AnswerRepository answerRepository;
    @Mock private QuestionRepository questionRepository;
    @Mock private EnrollmentRepository enrollmentRepository;
    @Mock private AnswerMapper answerMapper;
    @Mock private SecurityUtils securityUtils;

    @InjectMocks
    private AnswerService answerService;

    private Question question;
    private User teacher;
    private User student;
    private Answer answer;
    private CreateAnswerDto createAnswerDto;
    private UpdateAnswerDto updateAnswerDto;
    private TeacherAnswerDto teacherAnswerDto;
    private StudentAnswerDto studentAnswerDto;

    @BeforeEach
    public void setUp() {
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

        Quiz quiz = new Quiz();
        quiz.setId(1L);
        quiz.setTitle("Test Quiz");
        quiz.setCourse(course);

        question = new Question();
        question.setId(1L);
        question.setText("Test Question");
        question.setQuiz(quiz);

        answer = new Answer();
        answer.setId(1L);
        answer.setText("Test Answer");
        answer.setCorrect(true);
        answer.setQuestion(question);

        createAnswerDto = new CreateAnswerDto("New Answer", true);
        updateAnswerDto = new UpdateAnswerDto("Updated Answer", false);
        teacherAnswerDto = new TeacherAnswerDto(1L, "Test Answer", true, 1L);
        studentAnswerDto = new StudentAnswerDto(1L, "Test Answer", 1L);
    }

    /* -------------------- Create Answer -------------------- */

    @Test
    void createAnswer_ShouldCreateAnswer_WhenUserIsCourseCreator() {
        when(questionRepository.findById(question.getId())).thenReturn(Optional.of(question));
        when(securityUtils.getCurrentUserId()).thenReturn(teacher.getId());
        when(answerMapper.toEntity(createAnswerDto)).thenReturn(answer);
        when(answerRepository.save(answer)).thenReturn(answer);
        when(answerMapper.toTeacherDto(answer)).thenReturn(teacherAnswerDto);

        TeacherAnswerDto result = answerService.createAnswer(question.getId(), createAnswerDto);

        assertNotNull(result);
        assertEquals(teacherAnswerDto.getId(), result.getId());
        assertEquals(teacherAnswerDto.getText(), result.getText());
        assertEquals(teacherAnswerDto.isCorrect(), result.isCorrect());
        assertEquals(teacherAnswerDto.getQuestionId(), result.getQuestionId());

        assertEquals(question, answer.getQuestion());

        verify(questionRepository, times(1)).findById(question.getId());
        verify(securityUtils, times(1)).getCurrentUserId();
        verify(answerMapper, times(1)).toEntity(createAnswerDto);
        verify(answerRepository, times(1)).save(answer);
        verify(answerMapper, times(1)).toTeacherDto(answer);
    }

    @Test
    void createAnswer_ShouldThrowQuestionNotFoundException_WhenQuestionNotFound() {
        Long nonExistentQuestionId = 999L;
        when(questionRepository.findById(nonExistentQuestionId)).thenReturn(Optional.empty());

        assertThrows(
                QuestionNotFoundException.class,
                () -> answerService.createAnswer(nonExistentQuestionId, createAnswerDto)
        );

        verify(questionRepository, times(1)).findById(nonExistentQuestionId);
        verifyNoInteractions(securityUtils, answerMapper, answerRepository);
    }

    @Test
    void createAnswer_ShouldThrowAccessDeniedException_WhenUserIsNotCourseCreator() {
        when(questionRepository.findById(question.getId())).thenReturn(Optional.of(question));
        when(securityUtils.getCurrentUserId()).thenReturn(student.getId());

        assertThrows(
                AccessDeniedException.class,
                () -> answerService.createAnswer(question.getId(), createAnswerDto)
        );

        verify(questionRepository, times(1)).findById(question.getId());
        verify(securityUtils, times(1)).getCurrentUserId();
        verifyNoInteractions(answerMapper, answerRepository);
    }

    /* -------------------- Get Question Answers -------------------- */

    @Test
    void getQuestionAnswers_ShouldReturnTeacherDtos_WhenUserIsCourseCreator() {
        when(questionRepository.findById(question.getId())).thenReturn(Optional.of(question));
        when(securityUtils.getCurrentUserId()).thenReturn(teacher.getId());
        when(answerRepository.findByQuestionId(question.getId())).thenReturn(List.of(answer));
        when(answerMapper.toTeacherDto(answer)).thenReturn(teacherAnswerDto);

        List<?> result = answerService.getQuestionAnswers(question.getId());

        assertNotNull(result);
        assertEquals(1, result.size());
        assertInstanceOf(TeacherAnswerDto.class, result.get(0));

        TeacherAnswerDto dto = (TeacherAnswerDto) result.get(0);
        assertEquals(teacherAnswerDto.getId(), dto.getId());
        assertEquals(teacherAnswerDto.getText(), dto.getText());
        assertEquals(teacherAnswerDto.isCorrect(), dto.isCorrect());
        assertEquals(teacherAnswerDto.getQuestionId(), dto.getQuestionId());

        verify(questionRepository, times(1)).findById(question.getId());
        verify(securityUtils, times(1)).getCurrentUserId();
        verify(answerRepository, times(1)).findByQuestionId(question.getId());
        verify(answerMapper, times(1)).toTeacherDto(answer);
        verify(enrollmentRepository, never()).existsById(any(EnrollmentId.class));
    }

    @Test
    void getQuestionAnswers_ShouldReturnStudentDtos_WhenUserIsEnrolledInCourse() {
        when(questionRepository.findById(question.getId())).thenReturn(Optional.of(question));
        when(securityUtils.getCurrentUserId()).thenReturn(student.getId());
        when(enrollmentRepository.existsById(any(EnrollmentId.class))).thenReturn(true);
        when(answerRepository.findByQuestionId(question.getId())).thenReturn(List.of(answer));
        when(answerMapper.toStudentDto(answer)).thenReturn(studentAnswerDto);

        List<?> result = answerService.getQuestionAnswers(question.getId());

        assertNotNull(result);
        assertEquals(1, result.size());
        assertInstanceOf(StudentAnswerDto.class, result.get(0));

        StudentAnswerDto dto = (StudentAnswerDto) result.get(0);
        assertEquals(studentAnswerDto.getId(), dto.getId());
        assertEquals(studentAnswerDto.getText(), dto.getText());
        assertEquals(studentAnswerDto.getQuestionId(), dto.getQuestionId());

        verify(questionRepository, times(1)).findById(question.getId());
        verify(securityUtils, times(1)).getCurrentUserId();
        verify(enrollmentRepository, times(1)).existsById(any(EnrollmentId.class));
        verify(answerRepository, times(1)).findByQuestionId(question.getId());
        verify(answerMapper, times(1)).toStudentDto(answer);
        verify(answerMapper, never()).toTeacherDto(any(Answer.class));
    }

    @Test
    void getQuestionAnswers_ShouldThrowQuestionNotFoundException_WhenQuestionNotFound() {
        Long nonExistentQuestionId = 999L;
        when(questionRepository.findById(nonExistentQuestionId)).thenReturn(Optional.empty());

        assertThrows(
                QuestionNotFoundException.class,
                () -> answerService.getQuestionAnswers(nonExistentQuestionId)
        );

        verify(questionRepository, times(1)).findById(nonExistentQuestionId);
        verifyNoInteractions(securityUtils, enrollmentRepository, answerRepository, answerMapper);
    }

    @Test
    void getQuestionAnswers_ShouldThrowAccessDeniedException_WhenUserIsNotAuthorized() {
        User unauthorizedUser = new User();
        unauthorizedUser.setId(3L);

        when(questionRepository.findById(question.getId())).thenReturn(Optional.of(question));
        when(securityUtils.getCurrentUserId()).thenReturn(unauthorizedUser.getId());
        when(enrollmentRepository.existsById(any(EnrollmentId.class))).thenReturn(false);

        assertThrows(
                AccessDeniedException.class,
                () -> answerService.getQuestionAnswers(question.getId())
        );

        verify(questionRepository, times(1)).findById(question.getId());
        verify(securityUtils, times(1)).getCurrentUserId();
        verify(enrollmentRepository, times(1)).existsById(any(EnrollmentId.class));
        verifyNoInteractions(answerRepository, answerMapper);
    }

    @Test
    void getQuestionAnswers_ShouldReturnEmptyList_WhenNoAnswersExist() {
        when(questionRepository.findById(question.getId())).thenReturn(Optional.of(question));
        when(securityUtils.getCurrentUserId()).thenReturn(teacher.getId());
        when(answerRepository.findByQuestionId(question.getId())).thenReturn(List.of());

        List<?> result = answerService.getQuestionAnswers(question.getId());

        assertNotNull(result);
        assertTrue(result.isEmpty());

        verify(questionRepository, times(1)).findById(question.getId());
        verify(securityUtils, times(1)).getCurrentUserId();
        verify(answerRepository, times(1)).findByQuestionId(question.getId());
        verify(answerMapper, never()).toTeacherDto(any(Answer.class));
        verify(answerMapper, never()).toStudentDto(any(Answer.class));
    }

    /* -------------------- Update Answer -------------------- */

    @Test
    void updateAnswer_ShouldUpdateAnswer_WhenUserIsCourseCreator() {
        when(answerRepository.findById(answer.getId())).thenReturn(Optional.of(answer));
        when(securityUtils.getCurrentUserId()).thenReturn(teacher.getId());
        doNothing().when(answerMapper).update(eq(updateAnswerDto), any(Answer.class));
        when(answerRepository.save(answer)).thenReturn(answer);
        when(answerMapper.toTeacherDto(answer)).thenReturn(teacherAnswerDto);

        TeacherAnswerDto result = answerService.updateAnswer(answer.getId(), updateAnswerDto);

        assertNotNull(result);
        assertEquals(teacherAnswerDto.getId(), result.getId());
        assertEquals(teacherAnswerDto.getText(), result.getText());
        assertEquals(teacherAnswerDto.isCorrect(), result.isCorrect());
        assertEquals(teacherAnswerDto.getQuestionId(), result.getQuestionId());

        verify(answerRepository, times(1)).findById(answer.getId());
        verify(securityUtils, times(1)).getCurrentUserId();
        verify(answerMapper, times(1)).update(updateAnswerDto, answer);
        verify(answerRepository, times(1)).save(answer);
        verify(answerMapper, times(1)).toTeacherDto(answer);
    }

    @Test
    void updateAnswer_ShouldThrowAnswerNotFoundException_WhenAnswerNotFound() {
        Long nonExistentAnswerId = 999L;
        when(answerRepository.findById(nonExistentAnswerId)).thenReturn(Optional.empty());

        assertThrows(
                AnswerNotFoundException.class,
                () -> answerService.updateAnswer(nonExistentAnswerId, updateAnswerDto)
        );

        verify(answerRepository, times(1)).findById(nonExistentAnswerId);
        verifyNoInteractions(securityUtils, answerMapper);
    }

    @Test
    void updateAnswer_ShouldThrowAccessDeniedException_WhenUserIsNotCourseCreator() {
        when(answerRepository.findById(answer.getId())).thenReturn(Optional.of(answer));
        when(securityUtils.getCurrentUserId()).thenReturn(student.getId());

        assertThrows(
                AccessDeniedException.class,
                () -> answerService.updateAnswer(answer.getId(), updateAnswerDto)
        );

        verify(answerRepository, times(1)).findById(answer.getId());
        verify(securityUtils, times(1)).getCurrentUserId();
        verifyNoInteractions(answerMapper);
    }

    /* -------------------- Delete Answer -------------------- */

    @Test
    void deleteAnswer_ShouldDeleteAnswer_WhenUserIsCourseCreator() {
        when(answerRepository.findById(answer.getId())).thenReturn(Optional.of(answer));
        when(securityUtils.getCurrentUserId()).thenReturn(teacher.getId());
        doNothing().when(answerRepository).delete(answer);

        answerService.deleteAnswer(answer.getId());

        verify(answerRepository, times(1)).findById(answer.getId());
        verify(securityUtils, times(1)).getCurrentUserId();
        verify(answerRepository, times(1)).delete(answer);
    }

    @Test
    void deleteAnswer_ShouldThrowAnswerNotFoundException_WhenAnswerNotFound() {
        Long nonExistentAnswerId = 999L;
        when(answerRepository.findById(nonExistentAnswerId)).thenReturn(Optional.empty());

        assertThrows(
                AnswerNotFoundException.class,
                () -> answerService.deleteAnswer(nonExistentAnswerId)
        );

        verify(answerRepository, times(1)).findById(nonExistentAnswerId);
        verifyNoInteractions(securityUtils);
    }

    @Test
    void deleteAnswer_ShouldThrowAccessDeniedException_WhenUserIsNotCourseCreator() {
        when(answerRepository.findById(answer.getId())).thenReturn(Optional.of(answer));
        when(securityUtils.getCurrentUserId()).thenReturn(student.getId());

        assertThrows(
                AccessDeniedException.class,
                () -> answerService.deleteAnswer(answer.getId())
        );

        verify(answerRepository, times(1)).findById(answer.getId());
        verify(securityUtils, times(1)).getCurrentUserId();
        verify(answerRepository, never()).delete(any(Answer.class));
    }
}
