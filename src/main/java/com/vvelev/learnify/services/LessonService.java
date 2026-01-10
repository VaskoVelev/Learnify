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
import lombok.AllArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;

@AllArgsConstructor
@Service
public class LessonService {
    private final LessonRepository lessonRepository;
    private final CourseRepository courseRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final LessonMapper lessonMapper;

    public LessonDto createLesson(Long courseId, CreateLessonDto request) {
        Course course = courseRepository.findById(courseId).orElseThrow(CourseNotFoundException::new);

        Long teacherId = (Long) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (!Objects.equals(course.getCreatedBy().getId(), teacherId)) {
            throw new AccessDeniedException();
        }

        Lesson lesson = lessonMapper.toEntity(request);
        lesson.setCourse(course);
        lessonRepository.save(lesson);

        return lessonMapper.toDto(lesson);
    }

    public List<LessonDto> getCourseLessons(Long courseId) {
        Course course = courseRepository.findById(courseId).orElseThrow(CourseNotFoundException::new);

        Long userId = (Long) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (!Objects.equals(course.getCreatedBy().getId(), userId) && !enrollmentRepository.existsById(new EnrollmentId(userId, courseId))) {
            throw new AccessDeniedException();
        }

        return lessonRepository.findByCourseId(courseId)
                .stream()
                .map(lessonMapper::toDto)
                .toList();
    }

    public LessonDto getLesson(Long id) {
        Lesson lesson = lessonRepository.findById(id).orElseThrow(LessonNotFoundException::new);
        Course course = lesson.getCourse();

        Long userId = (Long) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (!Objects.equals(course.getCreatedBy().getId(), userId) && !enrollmentRepository.existsById(new EnrollmentId(userId, course.getId()))) {
            throw new AccessDeniedException();
        }

        return lessonMapper.toDto(lesson);
    }

    public LessonDto updateLesson(Long id, UpdateLessonDto request) {
        Lesson lesson = lessonRepository.findById(id).orElseThrow(LessonNotFoundException::new);
        Course course = lesson.getCourse();

        Long teacherId = (Long) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (!Objects.equals(course.getCreatedBy().getId(), teacherId)) {
            throw new AccessDeniedException();
        }

        lessonMapper.update(request, lesson);
        lessonRepository.save(lesson);

        return lessonMapper.toDto(lesson);
    }

    public void deleteLesson(Long id) {
        Lesson lesson = lessonRepository.findById(id).orElseThrow(LessonNotFoundException::new);
        Course course = lesson.getCourse();

        Long teacherId = (Long) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (!Objects.equals(course.getCreatedBy().getId(), teacherId)) {
            throw new AccessDeniedException();
        }

        lessonRepository.delete(lesson);
    }
}
