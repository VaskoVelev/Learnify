package com.vvelev.learnify.services;

import com.vvelev.learnify.dtos.course.CourseDto;
import com.vvelev.learnify.dtos.course.CreateCourseDto;
import com.vvelev.learnify.dtos.course.UpdateCourseDto;
import com.vvelev.learnify.entities.Course;
import com.vvelev.learnify.entities.User;
import com.vvelev.learnify.exceptions.AccessDeniedException;
import com.vvelev.learnify.exceptions.CourseNotFoundException;
import com.vvelev.learnify.exceptions.UserNotFoundException;
import com.vvelev.learnify.mappers.CourseMapper;
import com.vvelev.learnify.repositories.CourseRepository;
import com.vvelev.learnify.repositories.UserRepository;
import com.vvelev.learnify.utils.SecurityUtils;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@AllArgsConstructor
@Service
public class CourseService {
    private final CourseRepository courseRepository;
    private final UserRepository userRepository;
    private final CourseMapper courseMapper;
    private final SecurityUtils securityUtils;

    public CourseDto createCourse(CreateCourseDto request) {
        Long teacherId = securityUtils.getCurrentUserId();
        User teacher = getUserOrThrow(teacherId);

        Course course = courseMapper.toEntity(request);
        course.setCreatedBy(teacher);
        courseRepository.save(course);

        return courseMapper.toDto(course);
    }

    public List<CourseDto> getAllCourses() {
        return courseRepository
                .findAll()
                .stream()
                .map(courseMapper::toDto)
                .toList();
    }

    public CourseDto getCourse(Long courseId) {
        Course course = getCourseOrThrow(courseId);
        return courseMapper.toDto(course);
    }

    public List<CourseDto> getMyCoursesCreated() {
        Long teacherId = securityUtils.getCurrentUserId();

        return courseRepository
                .findByCreatedById(teacherId)
                .stream()
                .map(courseMapper::toDto)
                .toList();
    }

    public CourseDto updateCourse(Long courseId, UpdateCourseDto request) {
        Course course = getCourseOrThrow(courseId);

        Long teacherId = securityUtils.getCurrentUserId();
        if (!isCourseCreator(course, teacherId)) {
            throw new AccessDeniedException();
        }

        courseMapper.update(request, course);
        courseRepository.save(course);

        return courseMapper.toDto(course);
    }

    public void deleteCourse(Long courseId) {
        Course course = getCourseOrThrow(courseId);

        Long teacherId = securityUtils.getCurrentUserId();
        if (!isCourseCreator(course, teacherId)) {
            throw new AccessDeniedException();
        }

        courseRepository.delete(course);
    }

    private User getUserOrThrow(Long userId) {
        return userRepository
                .findById(userId)
                .orElseThrow(UserNotFoundException::new);
    }

    private Course getCourseOrThrow(Long courseId) {
        return courseRepository
                .findById(courseId)
                .orElseThrow(CourseNotFoundException::new);
    }

    private boolean isCourseCreator(Course course, Long teacherId) {
        return course.getCreatedBy().getId().equals(teacherId);
    }
}
