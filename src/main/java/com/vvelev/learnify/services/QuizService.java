package com.vvelev.learnify.services;

import com.vvelev.learnify.dtos.quiz.CreateQuizDto;
import com.vvelev.learnify.dtos.quiz.QuizDto;
import com.vvelev.learnify.dtos.quiz.UpdateQuizDto;
import com.vvelev.learnify.entities.Course;
import com.vvelev.learnify.entities.EnrollmentId;
import com.vvelev.learnify.entities.Quiz;
import com.vvelev.learnify.exceptions.AccessDeniedException;
import com.vvelev.learnify.exceptions.CourseNotFoundException;
import com.vvelev.learnify.exceptions.QuizNotFoundException;
import com.vvelev.learnify.mappers.QuizMapper;
import com.vvelev.learnify.repositories.CourseRepository;
import com.vvelev.learnify.repositories.EnrollmentRepository;
import com.vvelev.learnify.repositories.QuizRepository;
import lombok.AllArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;

@AllArgsConstructor
@Service
public class QuizService {
    private final QuizRepository quizRepository;
    private final CourseRepository courseRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final QuizMapper quizMapper;

    public QuizDto createQuiz(Long courseId, CreateQuizDto request) {
        Course course = courseRepository.findById(courseId).orElseThrow(CourseNotFoundException::new);

        Long teacherId = (Long) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (!Objects.equals(course.getCreatedBy().getId(), teacherId)) {
            throw new AccessDeniedException();
        }

        Quiz quiz = quizMapper.toEntity(request);
        quiz.setCourse(course);
        quizRepository.save(quiz);

        return quizMapper.toDto(quiz);
    }

    public List<QuizDto> getCourseQuizzes(Long courseId) {
        Course course = courseRepository.findById(courseId).orElseThrow(CourseNotFoundException::new);

        Long userId = (Long) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (!Objects.equals(course.getCreatedBy().getId(), userId) && !enrollmentRepository.existsById(new EnrollmentId(userId, courseId))) {
            throw new AccessDeniedException();
        }

        return quizRepository.findByCourseId(courseId)
                .stream()
                .map(quizMapper::toDto)
                .toList();
    }

    public QuizDto getQuiz(Long id) {
        Quiz quiz = quizRepository.findById(id).orElseThrow(QuizNotFoundException::new);
        Course course = quiz.getCourse();

        Long userId = (Long) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (!Objects.equals(course.getCreatedBy().getId(), userId) && !enrollmentRepository.existsById(new EnrollmentId(userId, course.getId()))) {
            throw new AccessDeniedException();
        }

        return quizMapper.toDto(quiz);
    }

    public QuizDto updateQuiz(Long id, UpdateQuizDto request) {
        Quiz quiz = quizRepository.findById(id).orElseThrow(QuizNotFoundException::new);
        Course course = quiz.getCourse();

        Long teacherId = (Long) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (!Objects.equals(course.getCreatedBy().getId(), teacherId)) {
            throw new AccessDeniedException();
        }

        quizMapper.update(request, quiz);
        quizRepository.save(quiz);

        return quizMapper.toDto(quiz);
    }

    public void deleteQuiz(Long id) {
        Quiz quiz = quizRepository.findById(id).orElseThrow(QuizNotFoundException::new);
        Course course = quiz.getCourse();

        Long teacherId = (Long) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (!Objects.equals(course.getCreatedBy().getId(), teacherId)) {
            throw new AccessDeniedException();
        }

        quizRepository.delete(quiz);
    }
}
