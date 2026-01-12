package com.vvelev.learnify.services;

import com.vvelev.learnify.dtos.answer.TeacherAnswerDto;
import com.vvelev.learnify.dtos.answer.CreateAnswerDto;
import com.vvelev.learnify.dtos.answer.UpdateAnswerDto;
import com.vvelev.learnify.entities.Answer;
import com.vvelev.learnify.entities.Course;
import com.vvelev.learnify.entities.EnrollmentId;
import com.vvelev.learnify.entities.Question;
import com.vvelev.learnify.exceptions.AccessDeniedException;
import com.vvelev.learnify.exceptions.AnswerNotFoundException;
import com.vvelev.learnify.exceptions.QuestionNotFoundException;
import com.vvelev.learnify.mappers.AnswerMapper;
import com.vvelev.learnify.repositories.AnswerRepository;
import com.vvelev.learnify.repositories.EnrollmentRepository;
import com.vvelev.learnify.repositories.QuestionRepository;
import lombok.AllArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;

@AllArgsConstructor
@Service
public class AnswerService {
    private final AnswerRepository answerRepository;
    private final QuestionRepository questionRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final AnswerMapper answerMapper;

    public TeacherAnswerDto createAnswer(Long questionId, CreateAnswerDto request) {
        Question question = questionRepository.findById(questionId).orElseThrow(QuestionNotFoundException::new);
        Course course = question.getQuiz().getCourse();

        Long teacherId = (Long) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (!Objects.equals(course.getCreatedBy().getId(), teacherId)) {
            throw new AccessDeniedException();
        }

        Answer answer = answerMapper.toEntity(request);
        answer.setQuestion(question);
        answerRepository.save(answer);

        return answerMapper.toTeacherDto(answer);
    }

    public List<?> getQuestionAnswers(Long questionId) {
        Question question = questionRepository.findById(questionId).orElseThrow(QuestionNotFoundException::new);
        Course course = question.getQuiz().getCourse();

        Long userId = (Long) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (Objects.equals(course.getCreatedBy().getId(), userId)) {
            return answerRepository.findByQuestionId(questionId)
                    .stream()
                    .map(answerMapper::toTeacherDto)
                    .toList();
        }

        if (enrollmentRepository.existsById(new EnrollmentId(userId, course.getId()))) {
            return answerRepository.findByQuestionId(questionId)
                    .stream()
                    .map(answerMapper::toStudentDto)
                    .toList();
        }

        throw new AccessDeniedException();
    }

    public TeacherAnswerDto updateAnswer(Long id, UpdateAnswerDto request) {
        Answer answer = answerRepository.findById(id).orElseThrow(AnswerNotFoundException::new);
        Course course = answer.getQuestion().getQuiz().getCourse();

        Long teacherId = (Long) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (!Objects.equals(course.getCreatedBy().getId(), teacherId)) {
            throw new AccessDeniedException();
        }

        answerMapper.update(request, answer);
        answerRepository.save(answer);

        return answerMapper.toTeacherDto(answer);
    }

    public void deleteAnswer(Long id) {
        Answer answer = answerRepository.findById(id).orElseThrow(AnswerNotFoundException::new);
        Course course = answer.getQuestion().getQuiz().getCourse();

        Long teacherId = (Long) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (!Objects.equals(course.getCreatedBy().getId(), teacherId)) {
            throw new AccessDeniedException();
        }

        answerRepository.delete(answer);
    }
}
