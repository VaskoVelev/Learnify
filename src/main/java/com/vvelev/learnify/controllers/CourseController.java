package com.vvelev.learnify.controllers;

import com.vvelev.learnify.dtos.CourseDto;
import com.vvelev.learnify.dtos.CreateCourseDto;
import com.vvelev.learnify.entities.Course;
import com.vvelev.learnify.mappers.CourseMapper;
import com.vvelev.learnify.repositories.CourseRepository;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.util.List;

@AllArgsConstructor
@RestController
public class CourseController {
    private CourseRepository courseRepository;
    private CourseMapper courseMapper;

    @GetMapping("/courses")
    public List<CourseDto> getAllCourses() {
        return courseRepository.findAll()
                .stream()
                .map(courseMapper::toDto)
                .toList();
    }

    @GetMapping("/courses/{id}")
    public ResponseEntity<CourseDto> getCourse(@PathVariable Long id) {
        Course course = courseRepository.findById(id).orElse(null);
        if (course == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(courseMapper.toDto(course));
    }

    @PostMapping("/courses")
    public ResponseEntity<CourseDto> createCourse(
            @RequestBody CreateCourseDto request,
            UriComponentsBuilder uriBuilder
    ) {
        Course course = courseMapper.toEntity(request);
        courseRepository.save(course);

        CourseDto courseDto = courseMapper.toDto(course);
        URI uri = uriBuilder.path("/courses/{id}").buildAndExpand(courseDto.getId()).toUri();

        return ResponseEntity.created(uri).body(courseDto);
    }
}
