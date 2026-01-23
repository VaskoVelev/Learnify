package com.vvelev.learnify.controllers;

import com.vvelev.learnify.constants.ApiPaths;
import com.vvelev.learnify.dtos.quiz.CreateQuizDto;
import com.vvelev.learnify.dtos.quiz.QuizDto;
import com.vvelev.learnify.dtos.quiz.UpdateQuizDto;
import com.vvelev.learnify.services.QuizService;
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
public class QuizController {
    private final QuizService quizService;

    @PreAuthorize("hasRole(Role.TEACHER.name())")
    @PostMapping(ApiPaths.COURSE_QUIZZES)
    public ResponseEntity<QuizDto> createQuiz(
            @PathVariable Long id,
            @Valid @RequestBody CreateQuizDto request,
            UriComponentsBuilder uriBuilder
    ) {
        QuizDto quizDto = quizService.createQuiz(id, request);
        URI uri = uriBuilder.path(ApiPaths.QUIZ_BY_ID).buildAndExpand(quizDto.getId()).toUri();

        return ResponseEntity.created(uri).body(quizDto);
    }

    @PreAuthorize("hasAnyRole(Role.TEACHER.name(), Role.STUDENT.name())")
    @GetMapping(ApiPaths.COURSE_QUIZZES)
    public List<QuizDto> getCourseQuizzes(@PathVariable Long id) {
        return quizService.getCourseQuizzes(id);
    }

    @PreAuthorize("hasAnyRole(Role.TEACHER.name(), Role.STUDENT.name())")
    @GetMapping(ApiPaths.QUIZ_BY_ID)
    public ResponseEntity<QuizDto> getQuiz(@PathVariable Long id) {
        QuizDto quizDto = quizService.getQuiz(id);
        return ResponseEntity.ok(quizDto);
    }

    @PreAuthorize("hasRole(Role.TEACHER.name())")
    @PutMapping(ApiPaths.QUIZ_BY_ID)
    public ResponseEntity<QuizDto> updateQuiz(
            @PathVariable Long id,
            @Valid @RequestBody UpdateQuizDto request
    ) {
        QuizDto quizDto = quizService.updateQuiz(id, request);
        return ResponseEntity.ok(quizDto);
    }

    @PreAuthorize("hasRole(Role.TEACHER.name())")
    @DeleteMapping(ApiPaths.QUIZ_BY_ID)
    public ResponseEntity<Void> deleteQuiz(@PathVariable Long id) {
        quizService.deleteQuiz(id);
        return ResponseEntity.noContent().build();
    }
}
