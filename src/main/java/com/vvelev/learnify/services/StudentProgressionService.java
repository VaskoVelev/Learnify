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
import com.vvelev.learnify.utils.SecurityUtils;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@AllArgsConstructor
@Service
public class StudentProgressionService {
    private final StudentProgressionRepository studentProgressionRepository;
    private final SubmissionRepository submissionRepository;
    private final QuizRepository quizRepository;
    private final CourseRepository courseRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final StudentProgressionMapper studentProgressionMapper;
    private final SecurityUtils securityUtils;

    public void updateProgression(User student, Course course) {
        StudentProgression progression = getOrCreateProgression(student, course);

        long totalQuizzes = quizRepository.countByCourseId(course.getId());
        long submittedQuizzes = submissionRepository.countDistinctQuizByStudentIdAndQuiz_Course_Id(student.getId(), course.getId());

        double progressionPercent = calculateProgressionPercent(submittedQuizzes, totalQuizzes);
        double averageScore = calculateAverageScore(student.getId(), course.getId());

        progression.setProgressionPercent(progressionPercent);
        progression.setAverageScore(averageScore);

        studentProgressionRepository.save(progression);
    }

    public StudentProgressionDto getMyProgression(Long courseId) {
        if (!courseExists(courseId)) {
            throw new CourseNotFoundException();
        }

        Long studentId = securityUtils.getCurrentUserId();
        if (!isStudentEnrolled(studentId, courseId)) {
            throw new AccessDeniedException();
        }

        StudentProgression progression = getProgressionOrThrow(studentId, courseId);

        return studentProgressionMapper.toDto(progression);
    }

    public List<StudentProgressionDto> getCourseProgressions(Long courseId) {
        Course course = getCourseOrThrow(courseId);

        Long teacherId = securityUtils.getCurrentUserId();
        if (!isCourseCreator(course, teacherId)) {
            throw new AccessDeniedException();
        }

        return studentProgressionRepository
                .findByCourseId(courseId)
                .stream()
                .map(studentProgressionMapper::toDto)
                .toList();
    }

    private boolean courseExists(Long courseId) {
        return courseRepository.existsById(courseId);
    }

    private Course getCourseOrThrow(Long courseId) {
        return courseRepository
                .findById(courseId)
                .orElseThrow(CourseNotFoundException::new);
    }

    private StudentProgression getOrCreateProgression(User student, Course course) {
        return studentProgressionRepository
                .findByStudentIdAndCourseId(student.getId(), course.getId())
                .orElseGet(() -> {
                    StudentProgression progression = new StudentProgression();
                    progression.setStudent(student);
                    progression.setCourse(course);
                    return progression;
                });
    }

    private StudentProgression getProgressionOrThrow(Long studentId, Long courseId) {
        return studentProgressionRepository
                .findByStudentIdAndCourseId(studentId, courseId)
                .orElseThrow(StudentProgressionNotFoundException::new);
    }

    private double calculateProgressionPercent(long submittedQuizzes, long totalQuizzes) {
        if (totalQuizzes == 0) {
            return 0;
        }

        return ((double) submittedQuizzes / totalQuizzes) * 100;
    }

    private double calculateAverageScore(Long studentId, Long courseId) {
        Double averageScore = submissionRepository.findAverageScoreByStudentIdAndCourseId(studentId, courseId);
        return averageScore != null ? averageScore : 0;
    }

    private boolean isStudentEnrolled(Long studentId, Long courseId) {
        return enrollmentRepository.existsById(new EnrollmentId(studentId, courseId));
    }

    private boolean isCourseCreator(Course course, Long teacherId) {
        return course.getCreatedBy().getId().equals(teacherId);
    }
}
