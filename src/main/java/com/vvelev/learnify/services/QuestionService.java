package com.vvelev.learnify.services;

import com.vvelev.learnify.dtos.question.CreateQuestionDto;
import com.vvelev.learnify.dtos.question.QuestionDto;
import com.vvelev.learnify.dtos.question.UpdateQuestionDto;
import com.vvelev.learnify.entities.Course;
import com.vvelev.learnify.entities.EnrollmentId;
import com.vvelev.learnify.entities.Question;
import com.vvelev.learnify.entities.Quiz;
import com.vvelev.learnify.exceptions.AccessDeniedException;
import com.vvelev.learnify.exceptions.QuestionNotFoundException;
import com.vvelev.learnify.exceptions.QuizNotFoundException;
import com.vvelev.learnify.mappers.QuestionMapper;
import com.vvelev.learnify.repositories.EnrollmentRepository;
import com.vvelev.learnify.repositories.QuestionRepository;
import com.vvelev.learnify.repositories.QuizRepository;
import lombok.AllArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;

@AllArgsConstructor
@Service
public class QuestionService {
    private final QuestionRepository questionRepository;
    private final QuizRepository quizRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final QuestionMapper questionMapper;

    public QuestionDto createQuestion(Long quizId, CreateQuestionDto request) {
        Quiz quiz = quizRepository.findById(quizId).orElseThrow(QuizNotFoundException::new);
        Course course = quiz.getCourse();

        Long teacherId = (Long) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (!Objects.equals(course.getCreatedBy().getId(), teacherId)) {
            throw new AccessDeniedException();
        }

        Question question = questionMapper.toEntity(request);
        question.setQuiz(quiz);
        questionRepository.save(question);

        return questionMapper.toDto(question);
    }

    public List<QuestionDto> getQuizQuestions(Long quizId) {
        Quiz quiz = quizRepository.findById(quizId).orElseThrow(QuizNotFoundException::new);
        Course course = quiz.getCourse();

        Long userId = (Long) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (!Objects.equals(course.getCreatedBy().getId(), userId) && !enrollmentRepository.existsById(new EnrollmentId(userId, course.getId()))) {
            throw new AccessDeniedException();
        }

        return questionRepository.findByQuizId(quizId)
                .stream()
                .map(questionMapper::toDto)
                .toList();
    }

    public QuestionDto updateQuestion(Long id, UpdateQuestionDto request) {
        Question question = questionRepository.findById(id).orElseThrow(QuestionNotFoundException::new);
        Course course = question.getQuiz().getCourse();

        Long teacherId = (Long) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (!Objects.equals(course.getCreatedBy().getId(), teacherId)) {
            throw new AccessDeniedException();
        }

        questionMapper.update(request, question);
        questionRepository.save(question);

        return questionMapper.toDto(question);
    }

    public void deleteQuestion(Long id) {
        Question question = questionRepository.findById(id).orElseThrow(QuestionNotFoundException::new);
        Course course = question.getQuiz().getCourse();

        Long teacherId = (Long) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (!Objects.equals(course.getCreatedBy().getId(), teacherId)) {
            throw new AccessDeniedException();
        }

        questionRepository.delete(question);
    }

}
