package com.vvelev.learnify.services;

import com.vvelev.learnify.dtos.submission.SubmissionDetailsDto;
import com.vvelev.learnify.dtos.submission.SubmissionDto;
import com.vvelev.learnify.dtos.submissionanswer.SubmissionAnswerDetailsDto;
import com.vvelev.learnify.dtos.submissionanswer.SubmissionAnswerDto;
import com.vvelev.learnify.entities.*;
import com.vvelev.learnify.exceptions.*;
import com.vvelev.learnify.mappers.SubmissionMapper;
import com.vvelev.learnify.repositories.*;
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
public class SubmissionServiceTest {
    @Mock private StudentProgressionService studentProgressionService;
    @Mock private QuizRepository quizRepository;
    @Mock private SubmissionRepository submissionRepository;
    @Mock private SubmissionAnswerRepository submissionAnswerRepository;
    @Mock private EnrollmentRepository enrollmentRepository;
    @Mock private UserRepository userRepository;
    @Mock private AnswerRepository answerRepository;
    @Mock private QuestionRepository questionRepository;
    @Mock private SubmissionMapper submissionMapper;
    @Mock private SecurityUtils securityUtils;

    @InjectMocks
    private SubmissionService submissionService;

    private User teacher;
    private User student;
    private Course course;
    private Quiz quiz;
    private Question question1;
    private Question question2;
    private Answer correctAnswer1;
    private Answer incorrectAnswer1;
    private Answer correctAnswer2;
    private Answer incorrectAnswer2;
    private Submission submission;
    private SubmissionDto submissionDto;
    private SubmissionDetailsDto submissionDetailsDto;
    private List<SubmissionAnswerDto> submissionAnswers;

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
        course.setCreatedBy(teacher);

        quiz = new Quiz();
        quiz.setId(1L);
        quiz.setTitle("Test Quiz");
        quiz.setCourse(course);

        question1 = new Question();
        question1.setId(1L);
        question1.setText("Question 1");
        question1.setQuiz(quiz);

        question2 = new Question();
        question2.setId(2L);
        question2.setText("Question 2");
        question2.setQuiz(quiz);

        correctAnswer1 = new Answer();
        correctAnswer1.setId(1L);
        correctAnswer1.setText("Correct Answer 1");
        correctAnswer1.setCorrect(true);
        correctAnswer1.setQuestion(question1);

        incorrectAnswer1 = new Answer();
        incorrectAnswer1.setId(2L);
        incorrectAnswer1.setText("Incorrect Answer 1");
        incorrectAnswer1.setCorrect(false);
        incorrectAnswer1.setQuestion(question1);

        correctAnswer2 = new Answer();
        correctAnswer2.setId(3L);
        correctAnswer2.setText("Correct Answer 2");
        correctAnswer2.setCorrect(true);
        correctAnswer2.setQuestion(question2);

        incorrectAnswer2 = new Answer();
        incorrectAnswer2.setId(4L);
        incorrectAnswer2.setText("Incorrect Answer 2");
        incorrectAnswer2.setCorrect(false);
        incorrectAnswer2.setQuestion(question2);

        LocalDateTime submittedAt = LocalDateTime.now();
        submission = new Submission();
        submission.setId(1L);
        submission.setQuiz(quiz);
        submission.setStudent(student);
        submission.setScore(75.0);
        submission.setSubmittedAt(submittedAt);

        submissionDto = new SubmissionDto(
                1L,
                75.0,
                submittedAt,
                quiz.getId(),
                student.getId()
        );

        SubmissionAnswerDetailsDto answerDetails1 = new SubmissionAnswerDetailsDto(
                question1.getId(),
                question1.getText(),
                correctAnswer1.getId(),
                correctAnswer1.getText(),
                true
        );

        SubmissionAnswerDetailsDto answerDetails2 = new SubmissionAnswerDetailsDto(
                question2.getId(),
                question2.getText(),
                incorrectAnswer2.getId(),
                incorrectAnswer2.getText(),
                false
        );

        submissionDetailsDto = new SubmissionDetailsDto(
                1L,
                75.0,
                submittedAt,
                quiz.getId(),
                student.getId(),
                List.of(answerDetails1, answerDetails2)
        );

        submissionAnswers = List.of(
                new SubmissionAnswerDto(question1.getId(), correctAnswer1.getId()),
                new SubmissionAnswerDto(question2.getId(), incorrectAnswer2.getId())
        );
    }

    /* -------------------- Submit Quiz -------------------- */

    @Test
    void submitQuiz_ShouldCreateSubmission_WhenUserIsEnrolledInCourse() {
        when(quizRepository.findById(quiz.getId())).thenReturn(Optional.of(quiz));
        when(securityUtils.getCurrentUserId()).thenReturn(student.getId());
        when(enrollmentRepository.existsById(any(EnrollmentId.class))).thenReturn(true);
        when(userRepository.findById(student.getId())).thenReturn(Optional.of(student));
        when(questionRepository.countByQuizId(quiz.getId())).thenReturn(2L);
        when(answerRepository.findById(correctAnswer1.getId())).thenReturn(Optional.of(correctAnswer1));
        when(answerRepository.findById(incorrectAnswer2.getId())).thenReturn(Optional.of(incorrectAnswer2));
        when(submissionRepository.save(any(Submission.class))).thenAnswer(invocation -> {
            Submission savedSubmission = invocation.getArgument(0);
            savedSubmission.setId(1L);
            savedSubmission.setSubmittedAt(LocalDateTime.now());
            return savedSubmission;
        });
        when(submissionAnswerRepository.save(any(SubmissionAnswer.class))).thenReturn(new SubmissionAnswer());
        when(submissionMapper.toDto(any(Submission.class))).thenReturn(submissionDto);

        SubmissionDto result = submissionService.submitQuiz(quiz.getId(), submissionAnswers);

        assertNotNull(result);
        assertEquals(submissionDto.getId(), result.getId());
        assertEquals(submissionDto.getScore(), result.getScore());
        assertEquals(submissionDto.getQuizId(), result.getQuizId());
        assertEquals(submissionDto.getStudentId(), result.getStudentId());

        verify(quizRepository, times(1)).findById(quiz.getId());
        verify(securityUtils, times(1)).getCurrentUserId();
        verify(enrollmentRepository, times(1)).existsById(any(EnrollmentId.class));
        verify(userRepository, times(1)).findById(student.getId());
        verify(questionRepository, times(1)).countByQuizId(quiz.getId());
        verify(answerRepository, times(2)).findById(anyLong());
        verify(submissionRepository, times(1)).save(any(Submission.class));
        verify(submissionAnswerRepository, times(2)).save(any(SubmissionAnswer.class));
        verify(studentProgressionService, times(1)).updateProgression(student, course);
        verify(submissionMapper, times(1)).toDto(any(Submission.class));
    }

    @Test
    void submitQuiz_ShouldCalculateScoreCorrectly_AllCorrect() {
        List<SubmissionAnswerDto> allCorrectAnswers = List.of(
                new SubmissionAnswerDto(question1.getId(), correctAnswer1.getId()),
                new SubmissionAnswerDto(question2.getId(), correctAnswer2.getId())
        );

        when(quizRepository.findById(quiz.getId())).thenReturn(Optional.of(quiz));
        when(securityUtils.getCurrentUserId()).thenReturn(student.getId());
        when(enrollmentRepository.existsById(any(EnrollmentId.class))).thenReturn(true);
        when(userRepository.findById(student.getId())).thenReturn(Optional.of(student));
        when(questionRepository.countByQuizId(quiz.getId())).thenReturn(2L);
        when(answerRepository.findById(correctAnswer1.getId())).thenReturn(Optional.of(correctAnswer1));
        when(answerRepository.findById(correctAnswer2.getId())).thenReturn(Optional.of(correctAnswer2));
        when(submissionRepository.save(any(Submission.class))).thenAnswer(invocation -> {
            Submission savedSubmission = invocation.getArgument(0);
            savedSubmission.setId(1L);
            return savedSubmission;
        });
        when(submissionAnswerRepository.save(any(SubmissionAnswer.class))).thenReturn(new SubmissionAnswer());

        SubmissionDto perfectScoreDto = new SubmissionDto(1L, 100.0, LocalDateTime.now(), quiz.getId(), student.getId());
        when(submissionMapper.toDto(any(Submission.class))).thenReturn(perfectScoreDto);

        SubmissionDto result = submissionService.submitQuiz(quiz.getId(), allCorrectAnswers);

        assertNotNull(result);
        assertEquals(100.0, result.getScore());

        verify(submissionRepository, times(1)).save(argThat(submission ->
                submission.getScore() == 100.0
        ));
    }

    @Test
    void submitQuiz_ShouldCalculateScoreCorrectly_AllIncorrect() {
        List<SubmissionAnswerDto> allIncorrectAnswers = List.of(
                new SubmissionAnswerDto(question1.getId(), incorrectAnswer1.getId()),
                new SubmissionAnswerDto(question2.getId(), incorrectAnswer2.getId())
        );

        when(quizRepository.findById(quiz.getId())).thenReturn(Optional.of(quiz));
        when(securityUtils.getCurrentUserId()).thenReturn(student.getId());
        when(enrollmentRepository.existsById(new EnrollmentId(student.getId(), course.getId()))).thenReturn(true);
        when(userRepository.findById(student.getId())).thenReturn(Optional.of(student));
        when(questionRepository.countByQuizId(quiz.getId())).thenReturn(2L);
        when(answerRepository.findById(incorrectAnswer1.getId())).thenReturn(Optional.of(incorrectAnswer1));
        when(answerRepository.findById(incorrectAnswer2.getId())).thenReturn(Optional.of(incorrectAnswer2));
        when(submissionRepository.save(any(Submission.class))).thenAnswer(invocation -> {
            Submission savedSubmission = invocation.getArgument(0);
            savedSubmission.setId(1L);
            return savedSubmission;
        });
        when(submissionAnswerRepository.save(any(SubmissionAnswer.class))).thenReturn(new SubmissionAnswer());

        SubmissionDto zeroScoreDto = new SubmissionDto(1L, 0.0, LocalDateTime.now(), quiz.getId(), student.getId());
        when(submissionMapper.toDto(any(Submission.class))).thenReturn(zeroScoreDto);

        SubmissionDto result = submissionService.submitQuiz(quiz.getId(), allIncorrectAnswers);

        assertNotNull(result);
        assertEquals(0.0, result.getScore());

        verify(submissionRepository, times(1)).save(argThat(submission ->
                submission.getScore() == 0.0
        ));
    }

    @Test
    void submitQuiz_ShouldCalculateScoreCorrectly_PartialCorrect() {
        when(quizRepository.findById(quiz.getId())).thenReturn(Optional.of(quiz));
        when(securityUtils.getCurrentUserId()).thenReturn(student.getId());
        when(enrollmentRepository.existsById(new EnrollmentId(student.getId(), course.getId()))).thenReturn(true);
        when(userRepository.findById(student.getId())).thenReturn(Optional.of(student));
        when(questionRepository.countByQuizId(quiz.getId())).thenReturn(2L);
        when(answerRepository.findById(correctAnswer1.getId())).thenReturn(Optional.of(correctAnswer1));
        when(answerRepository.findById(incorrectAnswer2.getId())).thenReturn(Optional.of(incorrectAnswer2));
        when(submissionRepository.save(any(Submission.class))).thenAnswer(invocation -> {
            Submission savedSubmission = invocation.getArgument(0);
            savedSubmission.setId(1L);
            savedSubmission.setScore(50.0);
            return savedSubmission;
        });
        when(submissionAnswerRepository.save(any(SubmissionAnswer.class))).thenReturn(new SubmissionAnswer());

        SubmissionDto partialScoreDto = new SubmissionDto(1L, 50.0, LocalDateTime.now(), quiz.getId(), student.getId());
        when(submissionMapper.toDto(any(Submission.class))).thenReturn(partialScoreDto);

        SubmissionDto result = submissionService.submitQuiz(quiz.getId(), submissionAnswers);

        assertNotNull(result);
        assertEquals(50.0, result.getScore());

        verify(submissionRepository, times(1)).save(argThat(submission ->
                submission.getScore() == 50.0
        ));
    }

    @Test
    void submitQuiz_ShouldThrowQuizNotFoundException_WhenQuizNotFound() {
        Long nonExistentQuizId = 999L;
        when(quizRepository.findById(nonExistentQuizId)).thenReturn(Optional.empty());

        assertThrows(
                QuizNotFoundException.class,
                () -> submissionService.submitQuiz(nonExistentQuizId, submissionAnswers)
        );

        verify(quizRepository, times(1)).findById(nonExistentQuizId);
        verifyNoInteractions(securityUtils, enrollmentRepository, userRepository, questionRepository);
    }

    @Test
    void submitQuiz_ShouldThrowAccessDeniedException_WhenUserIsNotEnrolledInCourse() {
        when(quizRepository.findById(quiz.getId())).thenReturn(Optional.of(quiz));
        when(securityUtils.getCurrentUserId()).thenReturn(teacher.getId());
        when(enrollmentRepository.existsById(any(EnrollmentId.class))).thenReturn(false);

        assertThrows(
                AccessDeniedException.class,
                () -> submissionService.submitQuiz(quiz.getId(), submissionAnswers)
        );

        verify(quizRepository, times(1)).findById(quiz.getId());
        verify(securityUtils, times(1)).getCurrentUserId();
        verify(enrollmentRepository, times(1)).existsById(any(EnrollmentId.class));
        verifyNoInteractions(userRepository, questionRepository);
    }

    @Test
    void submitQuiz_ShouldThrowUserNotFoundException_WhenUserNotFound() {
        Long nonExistentUserId = 999L;
        when(quizRepository.findById(quiz.getId())).thenReturn(Optional.of(quiz));
        when(securityUtils.getCurrentUserId()).thenReturn(nonExistentUserId);
        when(enrollmentRepository.existsById(any(EnrollmentId.class))).thenReturn(true);
        when(userRepository.findById(nonExistentUserId)).thenReturn(Optional.empty());

        assertThrows(
                UserNotFoundException.class,
                () -> submissionService.submitQuiz(quiz.getId(), submissionAnswers)
        );

        verify(quizRepository, times(1)).findById(quiz.getId());
        verify(securityUtils, times(1)).getCurrentUserId();
        verify(enrollmentRepository, times(1)).existsById(any(EnrollmentId.class));
        verify(userRepository, times(1)).findById(nonExistentUserId);
        verifyNoInteractions(questionRepository);
    }

    @Test
    void submitQuiz_ShouldThrowUnansweredQuestionsException_WhenNotAllQuestionsAnswered() {
        List<SubmissionAnswerDto> incompleteAnswers = List.of(
                new SubmissionAnswerDto(question1.getId(), correctAnswer1.getId())
        );

        when(quizRepository.findById(quiz.getId())).thenReturn(Optional.of(quiz));
        when(securityUtils.getCurrentUserId()).thenReturn(student.getId());
        when(enrollmentRepository.existsById(any(EnrollmentId.class))).thenReturn(true);
        when(userRepository.findById(student.getId())).thenReturn(Optional.of(student));
        when(questionRepository.countByQuizId(quiz.getId())).thenReturn(2L);

        assertThrows(
                UnansweredQuestionsException.class,
                () -> submissionService.submitQuiz(quiz.getId(), incompleteAnswers)
        );

        verify(questionRepository, times(1)).countByQuizId(quiz.getId());
        verifyNoInteractions(answerRepository, submissionRepository);
    }

    @Test
    void submitQuiz_ShouldThrowQuestionAlreadyAnsweredException_WhenDuplicateQuestions() {
        List<SubmissionAnswerDto> duplicateAnswers = List.of(
                new SubmissionAnswerDto(question1.getId(), correctAnswer1.getId()),
                new SubmissionAnswerDto(question1.getId(), incorrectAnswer1.getId())
        );

        when(quizRepository.findById(quiz.getId())).thenReturn(Optional.of(quiz));
        when(securityUtils.getCurrentUserId()).thenReturn(student.getId());
        when(enrollmentRepository.existsById(any(EnrollmentId.class))).thenReturn(true);
        when(userRepository.findById(student.getId())).thenReturn(Optional.of(student));
        when(questionRepository.countByQuizId(quiz.getId())).thenReturn(2L);

        assertThrows(
                QuestionAlreadyAnsweredException.class,
                () -> submissionService.submitQuiz(quiz.getId(), duplicateAnswers)
        );

        verify(questionRepository, times(1)).countByQuizId(quiz.getId());
        verifyNoInteractions(answerRepository, submissionRepository);
    }

    @Test
    void submitQuiz_ShouldThrowAnswerNotFoundException_WhenAnswerNotFound() {
        Long nonExistentAnswerId = 999L;
        List<SubmissionAnswerDto> invalidAnswers = List.of(
                new SubmissionAnswerDto(question1.getId(), nonExistentAnswerId)
        );

        when(quizRepository.findById(quiz.getId())).thenReturn(Optional.of(quiz));
        when(securityUtils.getCurrentUserId()).thenReturn(student.getId());
        when(enrollmentRepository.existsById(any(EnrollmentId.class))).thenReturn(true);
        when(userRepository.findById(student.getId())).thenReturn(Optional.of(student));
        when(questionRepository.countByQuizId(quiz.getId())).thenReturn(1L);
        when(answerRepository.findById(nonExistentAnswerId)).thenReturn(Optional.empty());

        assertThrows(
                AnswerNotFoundException.class,
                () -> submissionService.submitQuiz(quiz.getId(), invalidAnswers)
        );

        verify(answerRepository, times(1)).findById(nonExistentAnswerId);
        verifyNoInteractions(submissionRepository);
    }

    @Test
    void submitQuiz_ShouldThrowAnswerNotInQuizException_WhenAnswerBelongsToDifferentQuiz() {
        Quiz differentQuiz = new Quiz();
        differentQuiz.setId(2L);

        Answer answerFromDifferentQuiz = new Answer();
        answerFromDifferentQuiz.setId(5L);
        answerFromDifferentQuiz.setQuestion(question1);
        question1.setQuiz(differentQuiz);

        List<SubmissionAnswerDto> invalidAnswers = List.of(
                new SubmissionAnswerDto(question1.getId(), answerFromDifferentQuiz.getId())
        );

        when(quizRepository.findById(quiz.getId())).thenReturn(Optional.of(quiz));
        when(securityUtils.getCurrentUserId()).thenReturn(student.getId());
        when(enrollmentRepository.existsById(any(EnrollmentId.class))).thenReturn(true);
        when(userRepository.findById(student.getId())).thenReturn(Optional.of(student));
        when(questionRepository.countByQuizId(quiz.getId())).thenReturn(1L);
        when(answerRepository.findById(answerFromDifferentQuiz.getId())).thenReturn(Optional.of(answerFromDifferentQuiz));

        assertThrows(
                AnswerNotInQuizException.class,
                () -> submissionService.submitQuiz(quiz.getId(), invalidAnswers)
        );

        verify(answerRepository, times(1)).findById(answerFromDifferentQuiz.getId());
        verifyNoInteractions(submissionRepository);
    }

    @Test
    void submitQuiz_ShouldThrowAnswerNotInQuestionException_WhenAnswerDoesNotBelongToQuestion() {
        List<SubmissionAnswerDto> invalidAnswers = List.of(
                new SubmissionAnswerDto(question1.getId(), correctAnswer2.getId())
        );

        when(quizRepository.findById(quiz.getId())).thenReturn(Optional.of(quiz));
        when(securityUtils.getCurrentUserId()).thenReturn(student.getId());
        when(enrollmentRepository.existsById(any(EnrollmentId.class))).thenReturn(true);
        when(userRepository.findById(student.getId())).thenReturn(Optional.of(student));
        when(questionRepository.countByQuizId(quiz.getId())).thenReturn(1L);
        when(answerRepository.findById(correctAnswer2.getId())).thenReturn(Optional.of(correctAnswer2));

        assertThrows(
                AnswerNotInQuestionException.class,
                () -> submissionService.submitQuiz(quiz.getId(), invalidAnswers)
        );

        verify(answerRepository, times(1)).findById(correctAnswer2.getId());
        verifyNoInteractions(submissionRepository);
    }

    /* -------------------- Get Quiz Submissions -------------------- */

    @Test
    void getQuizSubmissions_ShouldReturnQuizSubmissions_WhenUserIsCourseCreator() {
        when(quizRepository.findById(quiz.getId())).thenReturn(Optional.of(quiz));
        when(securityUtils.getCurrentUserId()).thenReturn(teacher.getId());
        when(submissionRepository.findByQuizIdOrderBySubmittedAtDesc(quiz.getId())).thenReturn(List.of(submission));
        when(submissionMapper.toDto(submission)).thenReturn(submissionDto);

        List<SubmissionDto> result = submissionService.getQuizSubmissions(quiz.getId());

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(75.0, result.get(0).getScore());

        verify(quizRepository, times(1)).findById(quiz.getId());
        verify(securityUtils, times(1)).getCurrentUserId();
        verify(submissionRepository, times(1)).findByQuizIdOrderBySubmittedAtDesc(quiz.getId());
        verify(submissionMapper, times(1)).toDto(any(Submission.class));
    }

    @Test
    void getQuizSubmissions_ShouldThrowQuizNotFoundException_WhenQuizNotFound() {
        Long nonExistentQuizId = 999L;
        when(quizRepository.findById(nonExistentQuizId)).thenReturn(Optional.empty());

        assertThrows(
                QuizNotFoundException.class,
                () -> submissionService.getQuizSubmissions(nonExistentQuizId)
        );

        verify(quizRepository, times(1)).findById(nonExistentQuizId);
        verifyNoInteractions(securityUtils, submissionRepository, submissionMapper);
    }

    @Test
    void getQuizSubmissions_ShouldThrowAccessDeniedException_WhenUserIsNotCourseCreator() {
        when(quizRepository.findById(quiz.getId())).thenReturn(Optional.of(quiz));
        when(securityUtils.getCurrentUserId()).thenReturn(student.getId());

        assertThrows(
                AccessDeniedException.class,
                () -> submissionService.getQuizSubmissions(quiz.getId())
        );

        verify(quizRepository, times(1)).findById(quiz.getId());
        verify(securityUtils, times(1)).getCurrentUserId();
        verifyNoInteractions(submissionRepository, submissionMapper);
    }

    @Test
    void getQuizSubmissions_ShouldReturnEmptyList_WhenNoSubmissionsExist() {
        when(quizRepository.findById(quiz.getId())).thenReturn(Optional.of(quiz));
        when(securityUtils.getCurrentUserId()).thenReturn(teacher.getId());
        when(submissionRepository.findByQuizIdOrderBySubmittedAtDesc(quiz.getId())).thenReturn(List.of());

        List<SubmissionDto> result = submissionService.getQuizSubmissions(quiz.getId());

        assertNotNull(result);
        assertTrue(result.isEmpty());

        verify(quizRepository, times(1)).findById(quiz.getId());
        verify(securityUtils, times(1)).getCurrentUserId();
        verify(submissionRepository, times(1)).findByQuizIdOrderBySubmittedAtDesc(quiz.getId());
        verify(submissionMapper, never()).toDto(any(Submission.class));
    }

    /* -------------------- Get My Quiz Submissions -------------------- */

    @Test
    void getMyQuizSubmissions_ShouldReturnMyQuizSubmissions_WhenUserIsEnrolledInCourse() {
        when(quizRepository.findById(quiz.getId())).thenReturn(Optional.of(quiz));
        when(securityUtils.getCurrentUserId()).thenReturn(student.getId());
        when(enrollmentRepository.existsById(any(EnrollmentId.class))).thenReturn(true);
        when(submissionRepository.findByQuizIdAndStudentIdOrderBySubmittedAtDesc(quiz.getId(), student.getId()))
                .thenReturn(List.of(submission));
        when(submissionMapper.toDto(submission)).thenReturn(submissionDto);

        List<SubmissionDto> result = submissionService.getMyQuizSubmissions(quiz.getId());

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(student.getId(), result.get(0).getStudentId());

        verify(quizRepository, times(1)).findById(quiz.getId());
        verify(securityUtils, times(1)).getCurrentUserId();
        verify(enrollmentRepository, times(1)).existsById(any(EnrollmentId.class));
        verify(submissionRepository, times(1))
                .findByQuizIdAndStudentIdOrderBySubmittedAtDesc(quiz.getId(), student.getId());
        verify(submissionMapper, times(1)).toDto(any(Submission.class));
    }

    @Test
    void getMyQuizSubmissions_ShouldThrowQuizNotFoundException_WhenQuizNotFound() {
        Long nonExistentQuizId = 999L;
        when(quizRepository.findById(nonExistentQuizId)).thenReturn(Optional.empty());

        assertThrows(
                QuizNotFoundException.class,
                () -> submissionService.getMyQuizSubmissions(nonExistentQuizId)
        );

        verify(quizRepository, times(1)).findById(nonExistentQuizId);
        verifyNoInteractions(securityUtils, enrollmentRepository, submissionRepository, submissionMapper);
    }

    @Test
    void getMyQuizSubmissions_ShouldThrowAccessDeniedException_WhenUserIsNotEnrolledInCourse() {
        when(quizRepository.findById(quiz.getId())).thenReturn(Optional.of(quiz));
        when(securityUtils.getCurrentUserId()).thenReturn(student.getId());
        when(enrollmentRepository.existsById(any(EnrollmentId.class))).thenReturn(false);

        assertThrows(
                AccessDeniedException.class,
                () -> submissionService.getMyQuizSubmissions(quiz.getId())
        );

        verify(quizRepository, times(1)).findById(quiz.getId());
        verify(securityUtils, times(1)).getCurrentUserId();
        verify(enrollmentRepository, times(1)).existsById(any(EnrollmentId.class));
        verifyNoInteractions(submissionRepository, submissionMapper);
    }

    @Test
    void getMyQuizSubmissions_ShouldReturnEmptyList_WhenNoSubmissionsExist() {
        when(quizRepository.findById(quiz.getId())).thenReturn(Optional.of(quiz));
        when(securityUtils.getCurrentUserId()).thenReturn(student.getId());
        when(enrollmentRepository.existsById(any(EnrollmentId.class))).thenReturn(true);
        when(submissionRepository.findByQuizIdAndStudentIdOrderBySubmittedAtDesc(quiz.getId(), student.getId()))
                .thenReturn(List.of());

        List<SubmissionDto> result = submissionService.getMyQuizSubmissions(quiz.getId());

        assertNotNull(result);
        assertTrue(result.isEmpty());

        verify(quizRepository, times(1)).findById(quiz.getId());
        verify(securityUtils, times(1)).getCurrentUserId();
        verify(enrollmentRepository, times(1)).existsById(any(EnrollmentId.class));
        verify(submissionRepository, times(1))
                .findByQuizIdAndStudentIdOrderBySubmittedAtDesc(quiz.getId(), student.getId());
        verify(submissionMapper, never()).toDto(any(Submission.class));
    }

    /* -------------------- Get Submission -------------------- */

    @Test
    void getSubmission_ShouldReturnSubmissionDetails_WhenUserIsCourseCreator() {
        when(submissionRepository.findById(submission.getId())).thenReturn(Optional.of(submission));
        when(securityUtils.getCurrentUserId()).thenReturn(teacher.getId());
        when(enrollmentRepository.existsById(any(EnrollmentId.class))).thenReturn(false);
        when(submissionMapper.toDetailsDto(submission)).thenReturn(submissionDetailsDto);

        SubmissionDetailsDto result = submissionService.getSubmission(submission.getId());

        assertNotNull(result);
        assertEquals(submissionDetailsDto.getId(), result.getId());

        verify(submissionRepository, times(1)).findById(submission.getId());
        verify(securityUtils, times(1)).getCurrentUserId();
        verify(enrollmentRepository, times(1)).existsById(any(EnrollmentId.class));
        verify(submissionMapper, times(1)).toDetailsDto(submission);
    }

    @Test
    void getSubmission_ShouldReturnSubmissionDetails_WhenUserIsSubmissionCreator() {
        when(submissionRepository.findById(submission.getId())).thenReturn(Optional.of(submission));
        when(securityUtils.getCurrentUserId()).thenReturn(student.getId());
        when(enrollmentRepository.existsById(any(EnrollmentId.class))).thenReturn(true);
        when(submissionMapper.toDetailsDto(submission)).thenReturn(submissionDetailsDto);

        SubmissionDetailsDto result = submissionService.getSubmission(submission.getId());

        assertNotNull(result);
        assertEquals(submissionDetailsDto.getId(), result.getId());
        assertEquals(submissionDetailsDto.getScore(), result.getScore());
        assertEquals(submissionDetailsDto.getStudentId(), result.getStudentId());
        assertEquals(2, result.getAnswers().size());

        verify(submissionRepository, times(1)).findById(submission.getId());
        verify(securityUtils, times(1)).getCurrentUserId();
        verify(enrollmentRepository, times(1)).existsById(any(EnrollmentId.class));
        verify(submissionMapper, times(1)).toDetailsDto(submission);
    }

    @Test
    void getSubmission_ShouldThrowSubmissionNotFoundException_WhenSubmissionNotFound() {
        Long nonExistentSubmissionId = 999L;
        when(submissionRepository.findById(nonExistentSubmissionId)).thenReturn(Optional.empty());

        assertThrows(
                SubmissionNotFoundException.class,
                () -> submissionService.getSubmission(nonExistentSubmissionId)
        );

        verify(submissionRepository, times(1)).findById(nonExistentSubmissionId);
        verifyNoInteractions(securityUtils, enrollmentRepository, submissionMapper);
    }

    @Test
    void getSubmission_ShouldThrowAccessDeniedException_WhenUserNotAuthorized() {
        User unauthorizedUser = new User();
        unauthorizedUser.setId(3L);

        when(submissionRepository.findById(submission.getId())).thenReturn(Optional.of(submission));
        when(securityUtils.getCurrentUserId()).thenReturn(unauthorizedUser.getId());
        when(enrollmentRepository.existsById(any(EnrollmentId.class))).thenReturn(false);

        assertThrows(
                AccessDeniedException.class,
                () -> submissionService.getSubmission(submission.getId())
        );

        verify(submissionRepository, times(1)).findById(submission.getId());
        verify(securityUtils, times(1)).getCurrentUserId();
        verify(enrollmentRepository, times(1)).existsById(any(EnrollmentId.class));
        verifyNoInteractions(submissionMapper);
    }
}
