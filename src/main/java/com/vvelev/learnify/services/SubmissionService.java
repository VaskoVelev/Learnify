package com.vvelev.learnify.services;

import com.vvelev.learnify.dtos.submission.SubmissionDetailsDto;
import com.vvelev.learnify.dtos.submission.SubmissionDto;
import com.vvelev.learnify.dtos.submissionаnswer.SubmissionAnswerDto;
import com.vvelev.learnify.entities.*;
import com.vvelev.learnify.exceptions.*;
import com.vvelev.learnify.mappers.SubmissionMapper;
import com.vvelev.learnify.repositories.*;
import lombok.AllArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Objects;
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

    public SubmissionDto submitQuiz(Long quizId, List<SubmissionAnswerDto> answers) {
        Quiz quiz = quizRepository.findById(quizId).orElseThrow(QuizNotFoundException::new);
        Course course = quiz.getCourse();

        Long studentId = (Long) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (!enrollmentRepository.existsById(new EnrollmentId(studentId, course.getId()))) {
            throw new AccessDeniedException();
        }

        User student = userRepository.findById(studentId).orElseThrow(UserNotFoundException::new);

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

        Submission submission = new Submission();
        submission.setQuiz(quiz);
        submission.setStudent(student);
        submissionRepository.save(submission);

        long correct = 0;

        for (SubmissionAnswerDto dto : answers) {
            Answer answer = answerRepository.findById(dto.getAnswerId()).orElseThrow(AnswerNotFoundException::new);

            if (!answer.getQuestion().getQuiz().getId().equals(quizId)) {
                throw new AnswerNotInQuizException();
            }

            if (!answer.getQuestion().getId().equals(dto.getQuestionId())) {
                throw new AnswerNotInQuestionException();
            }

            SubmissionAnswer submissionAnswer = new SubmissionAnswer();
            submissionAnswer.setSubmission(submission);
            submissionAnswer.setQuestion(answer.getQuestion());
            submissionAnswer.setAnswer(answer);
            submissionAnswerRepository.save(submissionAnswer);

            if (answer.isCorrect()) {
                correct++;
            }
        }

        double score = ((double) correct / totalQuestions) * 100;
        submission.setScore(score);

        submissionRepository.save(submission);
        studentProgressionService.updateProgression(student, course);

        return submissionMapper.toDto(submission);
    }

    public List<SubmissionDto> getQuizSubmissions(Long quizId) {
        Quiz quiz = quizRepository.findById(quizId).orElseThrow(QuizNotFoundException::new);
        Course course = quiz.getCourse();

        Long teacherId = (Long) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (!Objects.equals(course.getCreatedBy().getId(), teacherId)) {
            throw new AccessDeniedException();
        }

        return submissionRepository.findByQuizIdOrderBySubmittedAtDesc(quizId)
                .stream()
                .map(submissionMapper::toDto)
                .toList();
    }

    public List<SubmissionDto> getMyQuizSubmissions(Long quizId) {
        Quiz quiz = quizRepository.findById(quizId).orElseThrow(QuizNotFoundException::new);
        Course course = quiz.getCourse();

        Long studentId = (Long) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (!enrollmentRepository.existsById(new EnrollmentId(studentId, course.getId()))) {
            throw new AccessDeniedException();
        }

        return submissionRepository.findByQuizIdAndStudentIdOrderBySubmittedAtDesc(quizId, studentId)
                .stream()
                .map(submissionMapper::toDto)
                .toList();
    }

    public SubmissionDetailsDto getSubmission(Long id) {
        Submission submission = submissionRepository.findById(id).orElseThrow(SubmissionNotFoundException::new);
        Course course = submission.getQuiz().getCourse();

        Long userId = (Long) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (!Objects.equals(course.getCreatedBy().getId(), userId) && !userId.equals(submission.getStudent().getId())) {
            throw new AccessDeniedException();
        }

        return submissionMapper.toDetailsDto(submission);
    }
}
