package com.vvelev.learnify.controllers;

import com.vvelev.learnify.constants.ApiPaths;
import com.vvelev.learnify.dtos.lesson.CreateLessonDto;
import com.vvelev.learnify.dtos.lesson.LessonDto;
import com.vvelev.learnify.dtos.lesson.UpdateLessonDto;
import com.vvelev.learnify.services.LessonService;
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
public class LessonController {
    private final LessonService lessonService;

    @PreAuthorize("hasRole(Role.TEACHER.name())")
    @PostMapping(ApiPaths.COURSE_LESSONS)
    public ResponseEntity<LessonDto> createLesson(
            @PathVariable Long id,
            @Valid @RequestBody CreateLessonDto request,
            UriComponentsBuilder uriBuilder
    ) {
        LessonDto lessonDto = lessonService.createLesson(id, request);
        URI uri = uriBuilder.path(ApiPaths.LESSON_BY_ID).buildAndExpand(lessonDto.getId()).toUri();

        return ResponseEntity.created(uri).body(lessonDto);
    }

    @PreAuthorize("hasAnyRole(Role.TEACHER.name(), Role.STUDENT.name())")
    @GetMapping(ApiPaths.COURSE_LESSONS)
    public List<LessonDto> getCourseLessons(@PathVariable Long id) {
        return lessonService.getCourseLessons(id);
    }

    @PreAuthorize("hasAnyRole(Role.TEACHER.name(), Role.STUDENT.name())")
    @GetMapping(ApiPaths.LESSON_BY_ID)
    public ResponseEntity<LessonDto> getLesson(@PathVariable Long id) {
        LessonDto lessonDto = lessonService.getLesson(id);
        return ResponseEntity.ok(lessonDto);
    }

    @PreAuthorize("hasRole(Role.TEACHER.name())")
    @PutMapping(ApiPaths.LESSON_BY_ID)
    public ResponseEntity<LessonDto> updateLesson(
            @PathVariable Long id,
            @Valid @RequestBody UpdateLessonDto request
    ) {
        LessonDto lessonDto = lessonService.updateLesson(id, request);
        return ResponseEntity.ok(lessonDto);
    }

    @PreAuthorize("hasRole(Role.TEACHER.name())")
    @DeleteMapping(ApiPaths.LESSON_BY_ID)
    public ResponseEntity<Void> deleteLesson(@PathVariable Long id) {
        lessonService.deleteLesson(id);
        return ResponseEntity.noContent().build();
    }
}
