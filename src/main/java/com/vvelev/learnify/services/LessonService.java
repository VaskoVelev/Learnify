package com.vvelev.learnify.services;

import com.vvelev.learnify.dtos.lesson.CreateLessonDto;
import com.vvelev.learnify.dtos.lesson.LessonDto;
import com.vvelev.learnify.dtos.lesson.UpdateLessonDto;
import com.vvelev.learnify.entities.Course;
import com.vvelev.learnify.entities.EnrollmentId;
import com.vvelev.learnify.entities.Lesson;
import com.vvelev.learnify.exceptions.AccessDeniedException;
import com.vvelev.learnify.exceptions.CourseNotFoundException;
import com.vvelev.learnify.exceptions.LessonNotFoundException;
import com.vvelev.learnify.mappers.LessonMapper;
import com.vvelev.learnify.repositories.CourseRepository;
import com.vvelev.learnify.repositories.EnrollmentRepository;
import com.vvelev.learnify.repositories.LessonRepository;
import com.vvelev.learnify.utils.SecurityUtils;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@AllArgsConstructor
@Service
public class LessonService {
    private final LessonRepository lessonRepository;
    private final CourseRepository courseRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final LessonMapper lessonMapper;
    private final SecurityUtils securityUtils;

    public LessonDto createLesson(Long courseId, CreateLessonDto request) {
        Course course = getCourseOrThrow(courseId);

        Long teacherId = securityUtils.getCurrentUserId();
        if (!isCourseCreator(course, teacherId)) {
            throw new AccessDeniedException();
        }

        Lesson lesson = lessonMapper.toEntity(request);
        lesson.setCourse(course);
        lessonRepository.save(lesson);

        return lessonMapper.toDto(lesson);
    }

    public List<LessonDto> getCourseLessons(Long courseId) {
        Course course = getCourseOrThrow(courseId);

        Long userId = securityUtils.getCurrentUserId();
        if (!isCourseCreator(course, userId) && !isStudentEnrolled(userId, courseId)) {
            throw new AccessDeniedException();
        }

        return lessonRepository
                .findByCourseId(courseId)
                .stream()
                .map(lessonMapper::toDto)
                .toList();
    }

    public LessonDto getLesson(Long lessonId) {
        Lesson lesson = getLessonOrThrow(lessonId);
        Course course = lesson.getCourse();

        Long userId = securityUtils.getCurrentUserId();
        if (!isCourseCreator(course, userId) && !isStudentEnrolled(userId, course.getId())) {
            throw new AccessDeniedException();
        }

        return lessonMapper.toDto(lesson);
    }

    public LessonDto updateLesson(Long lessonId, UpdateLessonDto request) {
        Lesson lesson = getLessonOrThrow(lessonId);
        Course course = lesson.getCourse();

        Long teacherId = securityUtils.getCurrentUserId();
        if (!isCourseCreator(course, teacherId)) {
            throw new AccessDeniedException();
        }

        lessonMapper.update(request, lesson);
        lessonRepository.save(lesson);

        return lessonMapper.toDto(lesson);
    }

    public void deleteLesson(Long lessonId) {
        Lesson lesson = getLessonOrThrow(lessonId);
        Course course = lesson.getCourse();

        Long teacherId = securityUtils.getCurrentUserId();
        if (!isCourseCreator(course, teacherId)) {
            throw new AccessDeniedException();
        }

        lessonRepository.delete(lesson);
    }

    private Course getCourseOrThrow(Long courseId) {
        return courseRepository
                .findById(courseId)
                .orElseThrow(CourseNotFoundException::new);
    }

    private Lesson getLessonOrThrow(Long lessonId) {
        return lessonRepository
                .findById(lessonId)
                .orElseThrow(LessonNotFoundException::new);
    }

    private boolean isStudentEnrolled(Long studentId, Long courseId) {
        return enrollmentRepository.existsById(new EnrollmentId(studentId, courseId));
    }

    private boolean isCourseCreator(Course course, Long teacherId) {
        return course.getCreatedBy().getId().equals(teacherId);
    }
}
