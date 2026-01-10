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
import lombok.AllArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;

@AllArgsConstructor
@Service
public class CourseService {
    private final CourseRepository courseRepository;
    private final UserRepository userRepository;
    private final CourseMapper courseMapper;

    public CourseDto createCourse(CreateCourseDto request) {
        Long teacherId = (Long) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User teacher = userRepository.findById(teacherId).orElseThrow(UserNotFoundException::new);

        Course course = courseMapper.toEntity(request);
        course.setCreatedBy(teacher);
        courseRepository.save(course);

        return courseMapper.toDto(course);
    }

    public List<CourseDto> getAllCourses() {
        return courseRepository.findAll()
                .stream()
                .map(courseMapper::toDto)
                .toList();
    }

    public CourseDto getCourse(Long id) {
        Course course = courseRepository.findById(id).orElseThrow(CourseNotFoundException::new);
        return courseMapper.toDto(course);
    }

    public List<CourseDto> getCoursesCreated(Long id) {
        Long teacherId = (Long) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (!teacherId.equals(id)) {
            throw new AccessDeniedException();
        }

        return courseRepository.findByCreatedById(id)
                .stream()
                .map(courseMapper::toDto)
                .toList();
    }

    public CourseDto updateCourse(Long id, UpdateCourseDto request) {
        Course course = courseRepository.findById(id).orElseThrow(CourseNotFoundException::new);

        Long teacherId = (Long) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (!Objects.equals(course.getCreatedBy().getId(), teacherId)) {
            throw new AccessDeniedException();
        }

        courseMapper.update(request, course);
        courseRepository.save(course);

        return courseMapper.toDto(course);
    }

    public void deleteCourse(Long id) {
        Course course = courseRepository.findById(id).orElseThrow(CourseNotFoundException::new);

        Long teacherId = (Long) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (!Objects.equals(course.getCreatedBy().getId(), teacherId)) {
            throw new AccessDeniedException();
        }

        courseRepository.delete(course);
    }
}
