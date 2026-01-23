package com.vvelev.learnify.controllers;

import com.vvelev.learnify.constants.ApiPaths;
import com.vvelev.learnify.dtos.course.CourseDto;
import com.vvelev.learnify.dtos.course.CreateCourseDto;
import com.vvelev.learnify.dtos.course.UpdateCourseDto;
import com.vvelev.learnify.dtos.studentprogression.StudentProgressionDto;
import com.vvelev.learnify.services.CourseService;
import com.vvelev.learnify.services.StudentProgressionService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.util.List;

@AllArgsConstructor
@RestController
public class CourseController {
    private CourseService courseService;
    private StudentProgressionService studentProgressionService;

    @PreAuthorize("hasRole(Role.TEACHER.name())")
    @PostMapping(ApiPaths.COURSES)
    public ResponseEntity<CourseDto> createCourse(
            @Valid @RequestBody CreateCourseDto request,
            UriComponentsBuilder uriBuilder
    ) {
        CourseDto courseDto = courseService.createCourse(request);
        URI uri = uriBuilder.path(ApiPaths.COURSE_BY_ID).buildAndExpand(courseDto.getId()).toUri();

        return ResponseEntity.created(uri).body(courseDto);
    }

    @GetMapping(ApiPaths.COURSES)
    public List<CourseDto> getAllCourses() {
        return courseService.getAllCourses();
    }

    @GetMapping(ApiPaths.COURSE_BY_ID)
    public ResponseEntity<CourseDto> getCourse(@PathVariable Long id) {
        CourseDto courseDto = courseService.getCourse(id);
        return ResponseEntity.ok(courseDto);
    }

    @PreAuthorize("hasRole(Role.TEACHER.name())")
    @GetMapping(ApiPaths.COURSES_CREATED_ME)
    public List<CourseDto> getMyCoursesCreated() {
        return courseService.getMyCoursesCreated();
    }

    @PreAuthorize("hasRole(Role.STUDENT.name())")
    @GetMapping(ApiPaths.COURSE_PROGRESSION_ME)
    public ResponseEntity<StudentProgressionDto> getMyProgression(@PathVariable Long id) {
        StudentProgressionDto studentProgressionDto = studentProgressionService.getMyProgression(id);
        return ResponseEntity.ok(studentProgressionDto);
    }

    @PreAuthorize("hasRole(Role.TEACHER.name())")
    @GetMapping(ApiPaths.COURSE_PROGRESSIONS)
    public List<StudentProgressionDto> getCourseProgressions(@PathVariable Long id) {
        return studentProgressionService.getCourseProgressions(id);
    }

    @PreAuthorize("hasRole(Role.TEACHER.name())")
    @PutMapping(ApiPaths.COURSE_BY_ID)
    public ResponseEntity<CourseDto> updateCourse(
            @PathVariable Long id,
            @Valid @RequestBody UpdateCourseDto request
    ) {
        CourseDto courseDto = courseService.updateCourse(id, request);
        return ResponseEntity.ok(courseDto);
    }

    @PreAuthorize("hasRole(Role.TEACHER.name())")
    @DeleteMapping(ApiPaths.COURSE_BY_ID)
    public ResponseEntity<Void> deleteCourse(@PathVariable Long id) {
        courseService.deleteCourse(id);
        return ResponseEntity.noContent().build();
    }
}
