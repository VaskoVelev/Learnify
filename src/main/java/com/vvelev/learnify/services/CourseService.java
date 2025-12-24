package com.vvelev.learnify.services;

import com.vvelev.learnify.dtos.course.CourseDto;
import com.vvelev.learnify.dtos.course.CreateCourseDto;
import com.vvelev.learnify.dtos.course.UpdateCourseDto;
import com.vvelev.learnify.entities.Course;
import com.vvelev.learnify.entities.User;
import com.vvelev.learnify.exceptions.CourseNotFoundException;
import com.vvelev.learnify.exceptions.UserNotFoundException;
import com.vvelev.learnify.mappers.CourseMapper;
import com.vvelev.learnify.repositories.CourseRepository;
import com.vvelev.learnify.repositories.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@AllArgsConstructor
@Service
public class CourseService {
    private final CourseRepository courseRepository;
    private final UserRepository userRepository;
    private final CourseMapper courseMapper;

    public List<CourseDto> getAllCourses() {
        return courseRepository.findAll()
                .stream()
                .map(courseMapper::toDto)
                .toList();
    }

    public CourseDto getCourse(Long id) {
        Course course = courseRepository.findById(id).orElse(null);
        if (course == null) {
            throw new CourseNotFoundException();
        }

        return courseMapper.toDto(course);
    }

    public List<CourseDto> getCoursesCreated(Long id) {
        User user = userRepository.findById(id).orElse(null);
        if (user == null) {
            throw new UserNotFoundException();
        }

        return courseRepository.findByCreatedById(id)
                .stream()
                .map(courseMapper::toDto)
                .toList();
    }

    public CourseDto createCourse(CreateCourseDto request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Long id = (Long) authentication.getPrincipal();

        User user = userRepository.findById(id).orElse(null);
        if (user == null) {
            throw new UserNotFoundException();
        }

        Course course = courseMapper.toEntity(request);
        course.setCreatedBy(user);
        courseRepository.save(course);

        return courseMapper.toDto(course);
    }

    public CourseDto updateCourse(Long id, UpdateCourseDto request) {
        Course course = courseRepository.findById(id).orElse(null);
        if (course == null) {
            throw new CourseNotFoundException();
        }

        courseMapper.update(request, course);
        courseRepository.save(course);

        return courseMapper.toDto(course);
    }

    public void deleteCourse(Long id) {
        Course course = courseRepository.findById(id).orElse(null);
        if (course == null) {
            throw new CourseNotFoundException();
        }

        courseRepository.delete(course);
    }
}
