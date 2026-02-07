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
import com.vvelev.learnify.utils.SecurityUtils;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@AllArgsConstructor
@Service
public class AnswerService {
    private final AnswerRepository answerRepository;
    private final QuestionRepository questionRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final AnswerMapper answerMapper;
    private final SecurityUtils securityUtils;

    public TeacherAnswerDto createAnswer(Long questionId, CreateAnswerDto request) {
        Question question = getQuestionOrThrow(questionId);
        Course course = question.getQuiz().getLesson().getCourse();

        Long teacherId = securityUtils.getCurrentUserId();
        if (!isCourseCreator(course, teacherId)) {
            throw new AccessDeniedException();
        }

        Answer answer = answerMapper.toEntity(request);
        answer.setQuestion(question);
        answerRepository.save(answer);

        return answerMapper.toTeacherDto(answer);
    }

    public List<?> getQuestionAnswers(Long questionId) {
        Question question = getQuestionOrThrow(questionId);
        Course course = question.getQuiz().getLesson().getCourse();

        Long userId = securityUtils.getCurrentUserId();

        if (isCourseCreator(course, userId)) {
            return answerRepository
                    .findByQuestionId(questionId)
                    .stream()
                    .map(answerMapper::toTeacherDto)
                    .toList();
        }

        if (isStudentEnrolled(userId, course.getId())) {
            return answerRepository
                    .findByQuestionId(questionId)
                    .stream()
                    .map(answerMapper::toStudentDto)
                    .toList();
        }

        throw new AccessDeniedException();
    }

    public TeacherAnswerDto updateAnswer(Long answerId, UpdateAnswerDto request) {
        Answer answer = getAnswerOrThrow(answerId);
        Course course = answer.getQuestion().getQuiz().getLesson().getCourse();

        Long teacherId = securityUtils.getCurrentUserId();
        if (!isCourseCreator(course, teacherId)) {
            throw new AccessDeniedException();
        }

        answerMapper.update(request, answer);
        answerRepository.save(answer);

        return answerMapper.toTeacherDto(answer);
    }

    public void deleteAnswer(Long answerId) {
        Answer answer = getAnswerOrThrow(answerId);
        Course course = answer.getQuestion().getQuiz().getLesson().getCourse();

        Long teacherId = securityUtils.getCurrentUserId();
        if (!isCourseCreator(course, teacherId)) {
            throw new AccessDeniedException();
        }

        answerRepository.delete(answer);
    }

    private Question getQuestionOrThrow(Long questionId) {
        return questionRepository
                .findById(questionId)
                .orElseThrow(QuestionNotFoundException::new);
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
}
