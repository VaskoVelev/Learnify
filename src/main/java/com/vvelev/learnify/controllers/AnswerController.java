package com.vvelev.learnify.controllers;

import com.vvelev.learnify.dtos.answer.TeacherAnswerDto;
import com.vvelev.learnify.dtos.answer.CreateAnswerDto;
import com.vvelev.learnify.dtos.answer.UpdateAnswerDto;
import com.vvelev.learnify.services.AnswerService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.util.List;

@AllArgsConstructor
@RestController
public class AnswerController {
    private final AnswerService answerService;

    @PostMapping("/questions/{id}/answers")
    public ResponseEntity<TeacherAnswerDto> createAnswer(
            @PathVariable Long id,
            @Valid @RequestBody CreateAnswerDto request,
            UriComponentsBuilder uriBuilder
    ) {
        TeacherAnswerDto answerDto = answerService.createAnswer(id, request);
        URI uri = uriBuilder.path("/answers/{id}").buildAndExpand(answerDto.getId()).toUri();

        return ResponseEntity.created(uri).body(answerDto);
    }

    @GetMapping("/questions/{id}/answers")
    public List<?> getQuestionAnswers(@PathVariable Long id) {
        return answerService.getQuestionAnswers(id);
    }

    @PutMapping("/answers/{id}")
    public ResponseEntity<TeacherAnswerDto> updateAnswer(
            @PathVariable Long id,
            @Valid @RequestBody UpdateAnswerDto request
    ) {
        TeacherAnswerDto answerDto = answerService.updateAnswer(id, request);
        return ResponseEntity.ok(answerDto);
    }

    @DeleteMapping("/answers/{id}")
    public ResponseEntity<Void> deleteAnswer(@PathVariable Long id) {
        answerService.deleteAnswer(id);
        return ResponseEntity.noContent().build();
    }
}
