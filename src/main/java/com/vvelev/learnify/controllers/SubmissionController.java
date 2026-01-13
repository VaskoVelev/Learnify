package com.vvelev.learnify.controllers;

import com.vvelev.learnify.dtos.submission.SubmissionDetailsDto;
import com.vvelev.learnify.dtos.submission.SubmissionDto;
import com.vvelev.learnify.dtos.submissionаnswer.SubmissionAnswerDto;
import com.vvelev.learnify.services.SubmissionService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@AllArgsConstructor
@RestController
public class SubmissionController {
    private final SubmissionService submissionService;

    @PostMapping("/quizzes/{id}/submit")
    public ResponseEntity<SubmissionDto> submitQuiz(
            @PathVariable Long id,
            @RequestBody List<SubmissionAnswerDto> answers
    ) {
        SubmissionDto submissionDto = submissionService.submitQuiz(id, answers);
        return ResponseEntity.status(HttpStatus.CREATED).body(submissionDto);
    }

    @GetMapping("/quizzes/{id}/submissions")
    public List<SubmissionDto> getQuizSubmissions(@PathVariable Long id) {
        return submissionService.getQuizSubmissions(id);
    }

    @GetMapping("/quizzes/{id}/submissions/me")
    public List<SubmissionDto> getMyQuizSubmissions(@PathVariable Long id) {
        return submissionService.getMyQuizSubmissions(id);
    }

    @GetMapping("/submissions/{id}")
    public ResponseEntity<?> getSubmission(@PathVariable Long id) {
        SubmissionDetailsDto submissionDto = submissionService.getSubmission(id);
        return ResponseEntity.ok(submissionDto);
    }
}
