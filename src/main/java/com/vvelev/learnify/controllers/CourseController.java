package com.vvelev.learnify.controllers;

import com.vvelev.learnify.dtos.course.CourseDto;
import com.vvelev.learnify.dtos.course.CreateCourseDto;
import com.vvelev.learnify.dtos.course.UpdateCourseDto;
import com.vvelev.learnify.services.CourseService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.util.List;

@AllArgsConstructor
@RestController
public class CourseController {
    private CourseService courseService;

    @PostMapping("/courses")
    public ResponseEntity<CourseDto> createCourse(
            @Valid @RequestBody CreateCourseDto request,
            UriComponentsBuilder uriBuilder
    ) {
        CourseDto courseDto = courseService.createCourse(request);
        URI uri = uriBuilder.path("/courses/{id}").buildAndExpand(courseDto.getId()).toUri();

        return ResponseEntity.created(uri).body(courseDto);
    }

    @GetMapping("/courses")
    public List<CourseDto> getAllCourses() {
        return courseService.getAllCourses();
    }

    @GetMapping("/courses/{id}")
    public ResponseEntity<CourseDto> getCourse(@PathVariable Long id) {
        CourseDto courseDto = courseService.getCourse(id);
        return ResponseEntity.ok(courseDto);
    }

    @GetMapping("/users/{id}/courses-created")
    public List<CourseDto> getCoursesCreated(@PathVariable Long id) {
        return courseService.getCoursesCreated(id);
    }

    @PutMapping("/courses/{id}")
    public ResponseEntity<CourseDto> updateCourse(
            @PathVariable Long id,
            @Valid @RequestBody UpdateCourseDto request
    ) {
        CourseDto courseDto = courseService.updateCourse(id, request);
        return ResponseEntity.ok(courseDto);
    }

    @DeleteMapping("/courses/{id}")
    public ResponseEntity<Void> deleteCourse(@PathVariable Long id) {
        courseService.deleteCourse(id);
        return ResponseEntity.noContent().build();
    }
}
