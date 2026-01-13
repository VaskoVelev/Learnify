package com.vvelev.learnify.services;

import com.vvelev.learnify.dtos.submission.SubmissionDetailsDto;
import com.vvelev.learnify.dtos.submission.SubmissionDto;
import com.vvelev.learnify.dtos.submissionаnswer.SubmissionAnswerDto;
import com.vvelev.learnify.entities.*;
import com.vvelev.learnify.exceptions.*;
import com.vvelev.learnify.mappers.SubmissionMapper;
import com.vvelev.learnify.repositories.*;
import com.vvelev.learnify.utils.SecurityUtils;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@AllArgsConstructor
@Service
public class SubmissionService {
    private final StudentProgressionService studentProgressionService;
    private final QuizRepository quizRepository;
    private final SubmissionRepository submissionRepository;
    private final SubmissionAnswerRepository submissionAnswerRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final UserRepository userRepository;
    private final AnswerRepository answerRepository;
    private final QuestionRepository questionRepository;
    private final SubmissionMapper submissionMapper;
    private final SecurityUtils securityUtils;

    public SubmissionDto submitQuiz(Long quizId, List<SubmissionAnswerDto> answers) {
        Quiz quiz = getQuizOrThrow(quizId);
        Course course = quiz.getCourse();

        Long studentId = securityUtils.getCurrentUserId();
        if (!isStudentEnrolled(studentId, course.getId())) {
            throw new AccessDeniedException();
        }

        User student = getStudentOrThrow(studentId);

        validateAnswers(quizId, answers);

        Submission submission = createSubmission(quiz, student);
        double score = processAnswers(submission, quizId, answers);

        submission.setScore(score);
        submissionRepository.save(submission);

        studentProgressionService.updateProgression(student, course);

        return submissionMapper.toDto(submission);
    }

    public List<SubmissionDto> getQuizSubmissions(Long quizId) {
        Quiz quiz = getQuizOrThrow(quizId);

        Long teacherId = securityUtils.getCurrentUserId();
        if (!isCourseCreator(quiz.getCourse(), teacherId)) {
            throw new AccessDeniedException();
        }

        return submissionRepository
                .findByQuizIdOrderBySubmittedAtDesc(quizId)
                .stream()
                .map(submissionMapper::toDto)
                .toList();
    }

    public List<SubmissionDto> getMyQuizSubmissions(Long quizId) {
        Quiz quiz = getQuizOrThrow(quizId);
        Course course = quiz.getCourse();

        Long studentId = securityUtils.getCurrentUserId();
        if (!isStudentEnrolled(studentId, course.getId())) {
            throw new AccessDeniedException();
        }

        return submissionRepository
                .findByQuizIdAndStudentIdOrderBySubmittedAtDesc(quizId, studentId)
                .stream()
                .map(submissionMapper::toDto)
                .toList();
    }

    public SubmissionDetailsDto getSubmission(Long id) {
        Submission submission = getSubmissionOrThrow(id);
        Course course = submission.getQuiz().getCourse();

        Long userId = securityUtils.getCurrentUserId();

        if (!isStudentEnrolled(userId, course.getId()) && !isSubmissionCreator(submission, userId)) {
            throw new AccessDeniedException();
        }

        return submissionMapper.toDetailsDto(submission);
    }

    private Quiz getQuizOrThrow(Long quizId) {
        return quizRepository
                .findById(quizId)
                .orElseThrow(QuizNotFoundException::new);
    }

    private User getStudentOrThrow(Long studentId) {
        return userRepository
                .findById(studentId)
                .orElseThrow(UserNotFoundException::new);
    }

    private Submission getSubmissionOrThrow(Long submissionId) {
        return submissionRepository
                .findById(submissionId)
                .orElseThrow(SubmissionNotFoundException::new);
    }

    private Answer getAnswerOrThrow(Long answerId) {
        return answerRepository
                .findById(answerId)
                .orElseThrow(AnswerNotFoundException::new);
    }

    private boolean isStudentEnrolled(Long studentId, Long courseId) {
        return enrollmentRepository.existsById(new EnrollmentId(studentId, courseId));
    }

    private boolean isCourseCreator(Course course, Long teacherId) {
        return course.getCreatedBy().getId().equals(teacherId);
    }

    private boolean isSubmissionCreator(Submission submission, Long studentId) {
        return submission.getStudent().getId().equals(studentId);
    }

    private void validateAnswers(Long quizId, List<SubmissionAnswerDto> answers) {
        long totalQuestions = questionRepository.countByQuizId(quizId);
        if (answers.size() != totalQuestions) {
            throw new UnansweredQuestionsException();
        }

        Set<Long> answeredQuestionsIds = new HashSet<>();
        for (SubmissionAnswerDto dto : answers) {
            if (!answeredQuestionsIds.add(dto.getQuestionId())) {
                throw new QuestionAlreadyAnsweredException();
            }
        }
    }

    private Submission createSubmission(Quiz quiz, User student) {
        Submission submission = new Submission();
        submission.setQuiz(quiz);
        submission.setStudent(student);

        return submission;
    }

    private double processAnswers(Submission submission, Long quizId, List<SubmissionAnswerDto> answers) {
        long correct = 0;

        for (SubmissionAnswerDto dto : answers) {
            Answer answer = getAnswerOrThrow(dto.getAnswerId());
            validateAnswer(answer, quizId, dto);

            createSubmissionAnswer(submission, answer);

            if (answer.isCorrect()) {
                correct++;
            }
        }

        return ((double) correct / answers.size()) * 100;
    }

    private void createSubmissionAnswer(Submission submission, Answer answer) {
        SubmissionAnswer submissionAnswer = new SubmissionAnswer();
        submissionAnswer.setSubmission(submission);
        submissionAnswer.setQuestion(answer.getQuestion());
        submissionAnswer.setAnswer(answer);
        submissionAnswerRepository.save(submissionAnswer);
    }

    private void validateAnswer(Answer answer, Long quizId, SubmissionAnswerDto dto) {
        if (!answer.getQuestion().getQuiz().getId().equals(quizId)) {
            throw new AnswerNotInQuizException();
        }

        if (!answer.getQuestion().getId().equals(dto.getQuestionId())) {
            throw new AnswerNotInQuestionException();
        }
    }
}
