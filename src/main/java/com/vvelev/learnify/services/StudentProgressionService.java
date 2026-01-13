package com.vvelev.learnify.services;

import com.vvelev.learnify.dtos.studentprogression.StudentProgressionDto;
import com.vvelev.learnify.entities.Course;
import com.vvelev.learnify.entities.EnrollmentId;
import com.vvelev.learnify.entities.StudentProgression;
import com.vvelev.learnify.entities.User;
import com.vvelev.learnify.exceptions.AccessDeniedException;
import com.vvelev.learnify.exceptions.CourseNotFoundException;
import com.vvelev.learnify.exceptions.StudentProgressionNotFoundException;
import com.vvelev.learnify.mappers.StudentProgressionMapper;
import com.vvelev.learnify.repositories.*;
import lombok.AllArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;

@AllArgsConstructor
@Service
public class StudentProgressionService {
    private final StudentProgressionRepository studentProgressionRepository;
    private final SubmissionRepository submissionRepository;
    private final QuizRepository quizRepository;
    private final CourseRepository courseRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final StudentProgressionMapper studentProgressionMapper;

    public void updateProgression(User student, Course course) {
        StudentProgression studentProgression = studentProgressionRepository
                .findByStudentIdAndCourseId(student.getId(), course.getId())
                .orElseGet(() -> {
                    StudentProgression progression = new StudentProgression();
                    progression.setStudent(student);
                    progression.setCourse(course);
                    return progression;
                });

        long totalQuizzes = quizRepository.countByCourseId(course.getId());
        long submittedQuizzes = submissionRepository.countDistinctQuizByStudentIdAndQuiz_Course_Id(student.getId(), course.getId());

        double progressionPercent = totalQuizzes == 0 ? 0 : ((double) submittedQuizzes / totalQuizzes) * 100;
        Double averageScore = submissionRepository.findAverageScoreByStudentIdAndCourseId(student.getId(), course.getId());

        studentProgression.setProgressionPercent(progressionPercent);
        studentProgression.setAverageScore(averageScore != null ? averageScore : 0);

        studentProgressionRepository.save(studentProgression);
    }

    public StudentProgressionDto getMyProgression(Long courseId) {
        Course course = courseRepository.findById(courseId).orElseThrow(CourseNotFoundException::new);

        Long studentId = (Long) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (!enrollmentRepository.existsById(new EnrollmentId(studentId, course.getId()))) {
            throw new AccessDeniedException();
        }

        StudentProgression studentProgression = studentProgressionRepository
                .findByStudentIdAndCourseId(studentId, course.getId())
                .orElseThrow(StudentProgressionNotFoundException::new);

        return studentProgressionMapper.toDto(studentProgression);
    }

    public List<StudentProgressionDto> getCourseProgressions(Long courseId) {
        Course course = courseRepository.findById(courseId).orElseThrow(CourseNotFoundException::new);

        Long teacherId = (Long) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (!Objects.equals(course.getCreatedBy().getId(), teacherId)) {
            throw new AccessDeniedException();
        }

        return studentProgressionRepository.findByCourseId(courseId)
                .stream()
                .map(studentProgressionMapper::toDto)
                .toList();
    }
}
