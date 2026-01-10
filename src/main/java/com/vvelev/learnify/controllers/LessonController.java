package com.vvelev.learnify.controllers;

import com.vvelev.learnify.dtos.lesson.CreateLessonDto;
import com.vvelev.learnify.dtos.lesson.LessonDto;
import com.vvelev.learnify.dtos.lesson.UpdateLessonDto;
import com.vvelev.learnify.services.LessonService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.util.List;

@AllArgsConstructor
@RestController
public class LessonController {
    private final LessonService lessonService;

    @PostMapping("/courses/{id}/lessons")
    public ResponseEntity<LessonDto> createLesson(
            @PathVariable Long id,
            @Valid @RequestBody CreateLessonDto request,
            UriComponentsBuilder uriBuilder
    ) {
        LessonDto lessonDto = lessonService.createLesson(id, request);
        URI uri = uriBuilder.path("/lessons/{id}").buildAndExpand(lessonDto.getId()).toUri();

        return ResponseEntity.created(uri).body(lessonDto);
    }

    @GetMapping("/courses/{id}/lessons")
    public List<LessonDto> getCourseLessons(@PathVariable Long id) {
        return lessonService.getCourseLessons(id);
    }

    @GetMapping("/lessons/{id}")
    public ResponseEntity<LessonDto> getLesson(@PathVariable Long id) {
        LessonDto lessonDto = lessonService.getLesson(id);
        return ResponseEntity.ok(lessonDto);
    }

    @PutMapping("/lessons/{id}")
    public ResponseEntity<LessonDto> updateLesson(
            @PathVariable Long id,
            @Valid @RequestBody UpdateLessonDto request
    ) {
        LessonDto lessonDto = lessonService.updateLesson(id, request);
        return ResponseEntity.ok(lessonDto);
    }

    @DeleteMapping("/lessons/{id}")
    public ResponseEntity<Void> deleteLesson(@PathVariable Long id) {
        lessonService.deleteLesson(id);
        return ResponseEntity.noContent().build();
    }
}
