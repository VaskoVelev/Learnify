package com.vvelev.learnify.controllers;

import com.vvelev.learnify.constants.ApiPaths;
import com.vvelev.learnify.dtos.submission.SubmissionDetailsDto;
import com.vvelev.learnify.dtos.submission.SubmissionDto;
import com.vvelev.learnify.dtos.submissionanswer.SubmissionAnswerDto;
import com.vvelev.learnify.services.SubmissionService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@AllArgsConstructor
@RestController
public class SubmissionController {
    private final SubmissionService submissionService;

    @PreAuthorize("hasRole(Role.STUDENT.name())")
    @PostMapping(ApiPaths.QUIZ_SUBMIT)
    public ResponseEntity<SubmissionDto> submitQuiz(
            @PathVariable Long id,
            @RequestBody List<SubmissionAnswerDto> answers
    ) {
        SubmissionDto submissionDto = submissionService.submitQuiz(id, answers);
        return ResponseEntity.status(HttpStatus.CREATED).body(submissionDto);
    }

    @PreAuthorize("hasRole(Role.TEACHER.name())")
    @GetMapping(ApiPaths.QUIZ_SUBMISSIONS)
    public List<SubmissionDto> getQuizSubmissions(@PathVariable Long id) {
        return submissionService.getQuizSubmissions(id);
    }

    @PreAuthorize("hasRole(Role.STUDENT.name())")
    @GetMapping(ApiPaths.QUIZ_SUBMISSIONS_ME)
    public List<SubmissionDto> getMyQuizSubmissions(@PathVariable Long id) {
        return submissionService.getMyQuizSubmissions(id);
    }

    @PreAuthorize("hasAnyRole(Role.STUDENT.name(), Role.TEACHER.name())")
    @GetMapping(ApiPaths.SUBMISSION_BY_ID)
    public ResponseEntity<?> getSubmission(@PathVariable Long id) {
        SubmissionDetailsDto submissionDto = submissionService.getSubmission(id);
        return ResponseEntity.ok(submissionDto);
    }
}
