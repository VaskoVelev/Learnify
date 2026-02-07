package com.vvelev.learnify.services;

import com.vvelev.learnify.dtos.quiz.CreateQuizDto;
import com.vvelev.learnify.dtos.quiz.QuizDto;
import com.vvelev.learnify.dtos.quiz.UpdateQuizDto;
import com.vvelev.learnify.entities.*;
import com.vvelev.learnify.exceptions.*;
import com.vvelev.learnify.mappers.QuizMapper;
import com.vvelev.learnify.repositories.EnrollmentRepository;
import com.vvelev.learnify.repositories.LessonRepository;
import com.vvelev.learnify.repositories.QuizRepository;
import com.vvelev.learnify.utils.SecurityUtils;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@AllArgsConstructor
@Service
public class QuizService {
    private final QuizRepository quizRepository;
    private final LessonRepository lessonRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final QuizMapper quizMapper;
    private final SecurityUtils securityUtils;

    public QuizDto createQuiz(Long lessonId, CreateQuizDto request) {
        Lesson lesson = getLessonOrThrow(lessonId);
        Course course = lesson.getCourse();

        Long teacherId = securityUtils.getCurrentUserId();
        if (!isCourseCreator(course, teacherId)) {
            throw new AccessDeniedException();
        }

        Quiz quiz = quizMapper.toEntity(request);
        quiz.setLesson(lesson);
        quizRepository.save(quiz);

        return quizMapper.toDto(quiz);
    }

    public List<QuizDto> getLessonQuizzes(Long lessonId) {
        Lesson lesson = getLessonOrThrow(lessonId);
        Course course = lesson.getCourse();

        Long userId = securityUtils.getCurrentUserId();
        if (!isCourseCreator(course, userId) && !isStudentEnrolled(userId, course.getId())) {
            throw new AccessDeniedException();
        }

        return quizRepository
                .findByLessonId(lessonId)
                .stream()
                .map(quizMapper::toDto)
                .toList();
    }

    public QuizDto getQuiz(Long quizId) {
        Quiz quiz = getQuizOrThrow(quizId);
        Course course = quiz.getLesson().getCourse();

        Long userId = securityUtils.getCurrentUserId();
        if (!isCourseCreator(course, userId) && !isStudentEnrolled(userId, course.getId())) {
            throw new AccessDeniedException();
        }

        return quizMapper.toDto(quiz);
    }

    public QuizDto updateQuiz(Long quizId, UpdateQuizDto request) {
        Quiz quiz = getQuizOrThrow(quizId);
        Course course = quiz.getLesson().getCourse();

        Long teacherId = securityUtils.getCurrentUserId();
        if (!isCourseCreator(course, teacherId)) {
            throw new AccessDeniedException();
        }

        quizMapper.update(request, quiz);
        quizRepository.save(quiz);

        return quizMapper.toDto(quiz);
    }

    public void deleteQuiz(Long quizId) {
        Quiz quiz = getQuizOrThrow(quizId);
        Course course = quiz.getLesson().getCourse();

        Long teacherId = securityUtils.getCurrentUserId();
        if (!isCourseCreator(course, teacherId)) {
            throw new AccessDeniedException();
        }

        quizRepository.delete(quiz);
    }

    private Lesson getLessonOrThrow(Long lessonId) {
        return lessonRepository
                .findById(lessonId)
                .orElseThrow(LessonNotFoundException::new);
    }

    private Quiz getQuizOrThrow(Long quizId) {
        return quizRepository
                .findById(quizId)
                .orElseThrow(QuizNotFoundException::new);
    }

    private boolean isStudentEnrolled(Long studentId, Long courseId) {
        return enrollmentRepository.existsById(new EnrollmentId(studentId, courseId));
    }

    private boolean isCourseCreator(Course course, Long teacherId) {
        return course.getCreatedBy().getId().equals(teacherId);
    }
}
