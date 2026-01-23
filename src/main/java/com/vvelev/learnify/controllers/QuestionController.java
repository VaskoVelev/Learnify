package com.vvelev.learnify.controllers;

import com.vvelev.learnify.constants.ApiPaths;
import com.vvelev.learnify.dtos.question.CreateQuestionDto;
import com.vvelev.learnify.dtos.question.QuestionDto;
import com.vvelev.learnify.dtos.question.UpdateQuestionDto;
import com.vvelev.learnify.services.QuestionService;
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
public class QuestionController {
    private final QuestionService questionService;

    @PreAuthorize("hasRole(Role.TEACHER.name())")
    @PostMapping(ApiPaths.QUIZ_QUESTIONS)
    public ResponseEntity<QuestionDto> createQuestion(
            @PathVariable Long id,
            @Valid @RequestBody CreateQuestionDto request,
            UriComponentsBuilder uriBuilder
    ) {
        QuestionDto questionDto = questionService.createQuestion(id, request);
        URI uri = uriBuilder.path(ApiPaths.QUESTION_BY_ID).buildAndExpand(questionDto.getId()).toUri();

        return ResponseEntity.created(uri).body(questionDto);
    }

    @PreAuthorize("hasAnyRole(Role.TEACHER.name(), Role.STUDENT.name())")
    @GetMapping(ApiPaths.QUIZ_QUESTIONS)
    public List<QuestionDto> getQuizQuestions(@PathVariable Long id) {
        return questionService.getQuizQuestions(id);
    }

    @PreAuthorize("hasRole(Role.TEACHER.name())")
    @PutMapping(ApiPaths.QUESTION_BY_ID)
    public ResponseEntity<QuestionDto> updateQuestion(
            @PathVariable Long id,
            @Valid @RequestBody UpdateQuestionDto request
    ) {
        QuestionDto questionDto = questionService.updateQuestion(id, request);
        return ResponseEntity.ok(questionDto);
    }

    @PreAuthorize("hasRole(Role.TEACHER.name())")
    @DeleteMapping(ApiPaths.QUESTION_BY_ID)
    public ResponseEntity<Void> deleteQuestion(@PathVariable Long id) {
        questionService.deleteQuestion(id);
        return ResponseEntity.noContent().build();
    }
}
