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
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@AllArgsConstructor
@Service
public class QuestionService {
    private final QuestionRepository questionRepository;
    private final QuizRepository quizRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final QuestionMapper questionMapper;
    private final SecurityUtils securityUtils;

    public QuestionDto createQuestion(Long quizId, CreateQuestionDto request) {
        Quiz quiz = getQuizOrThrow(quizId);
        Course course = quiz.getLesson().getCourse();

        Long teacherId = securityUtils.getCurrentUserId();
        if (!isCourseCreator(course, teacherId)) {
            throw new AccessDeniedException();
        }

        Question question = questionMapper.toEntity(request);
        question.setQuiz(quiz);
        questionRepository.save(question);

        return questionMapper.toDto(question);
    }

    public List<QuestionDto> getQuizQuestions(Long quizId) {
        Quiz quiz = getQuizOrThrow(quizId);
        Course course = quiz.getLesson().getCourse();

        Long userId = securityUtils.getCurrentUserId();
        if (!isCourseCreator(course, userId) && !isStudentEnrolled(userId, course.getId())) {
            throw new AccessDeniedException();
        }

        return questionRepository
                .findByQuizIdOrderById(quizId)
                .stream()
                .map(questionMapper::toDto)
                .toList();
    }

    public QuestionDto updateQuestion(Long questionId, UpdateQuestionDto request) {
        Question question = getQuestionOrThrow(questionId);
        Course course = question.getQuiz().getLesson().getCourse();

        Long teacherId = securityUtils.getCurrentUserId();
        if (!isCourseCreator(course, teacherId)) {
            throw new AccessDeniedException();
        }

        questionMapper.update(request, question);
        questionRepository.save(question);

        return questionMapper.toDto(question);
    }

    public void deleteQuestion(Long questionId) {
        Question question = getQuestionOrThrow(questionId);
        Course course = question.getQuiz().getLesson().getCourse();

        Long teacherId = securityUtils.getCurrentUserId();
        if (!isCourseCreator(course, teacherId)) {
            throw new AccessDeniedException();
        }

        questionRepository.delete(question);
    }

    private Quiz getQuizOrThrow(Long quizId) {
        return quizRepository
                .findById(quizId)
                .orElseThrow(QuizNotFoundException::new);
    }

    private Question getQuestionOrThrow(Long questionId) {
        return questionRepository
                .findById(questionId)
                .orElseThrow(QuestionNotFoundException::new);
    }

    private boolean isStudentEnrolled(Long studentId, Long courseId) {
        return enrollmentRepository.existsById(new EnrollmentId(studentId, courseId));
    }

    private boolean isCourseCreator(Course course, Long teacherId) {
        return course.getCreatedBy().getId().equals(teacherId);
    }
}
