package com.vvelev.learnify.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidationErrors(
            MethodArgumentNotValidException exception
    ) {
        Map<String, String> errors = new HashMap<>();

        exception.getBindingResult().getFieldErrors().forEach((error) ->
                errors.put(error.getField(), error.getDefaultMessage()));

        return ResponseEntity.badRequest().body(errors);
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<Void> handleBadCredentialsException() {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    @ExceptionHandler(DisabledException.class)
    public ResponseEntity<Void> handleDisabledException() {
        return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
    }

    @ExceptionHandler(EmailAlreadyExistsException.class)
    public ResponseEntity<Map<String, String>> handleEmailAlreadyExistsException(
            EmailAlreadyExistsException exception
    ) {
        return ResponseEntity.badRequest().body(
                Map.of("error", exception.getMessage())
        );
    }

    @ExceptionHandler(PasswordsDoNotMatchException.class)
    public ResponseEntity<Map<String, String>> handlePasswordsDoNotMatchException(
            PasswordsDoNotMatchException exception
    ) {
        return ResponseEntity.badRequest().body(
                Map.of("error", exception.getMessage())
        );
    }

    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<Void> handleUserNotFoundException() {
        return ResponseEntity.notFound().build();
    }

    @ExceptionHandler(InvalidTokenException.class)
    public ResponseEntity<Void> handleInvalidTokenException() {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    @ExceptionHandler(CourseNotFoundException.class)
    public ResponseEntity<Void> handleCourseNotFoundException() {
        return ResponseEntity.notFound().build();
    }

    @ExceptionHandler(StudentAlreadyEnrolledException.class)
    public ResponseEntity<Map<String, String>> handleStudentAlreadyEnrolledException(
            StudentAlreadyEnrolledException exception
    ) {
        return ResponseEntity.badRequest().body(
                Map.of("error", exception.getMessage())
        );
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<Void> handleAccessDeniedException() {
        return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
    }

    @ExceptionHandler(LessonNotFoundException.class)
    public ResponseEntity<Void> handleLessonNotFoundException() {
        return ResponseEntity.notFound().build();
    }

    @ExceptionHandler(MaterialNotFoundException.class)
    public ResponseEntity<Void> handleMaterialNotFoundException() {
        return ResponseEntity.notFound().build();
    }

    @ExceptionHandler(QuizNotFoundException.class)
    public ResponseEntity<Void> handleQuizNotFoundException() {
        return ResponseEntity.notFound().build();
    }

    @ExceptionHandler(QuestionNotFoundException.class)
    public ResponseEntity<Void> handleQuestionNotFoundException() {
        return ResponseEntity.notFound().build();
    }

    @ExceptionHandler(AnswerNotFoundException.class)
    public ResponseEntity<Void> handleAnswerNotFoundException() {
        return ResponseEntity.notFound().build();
    }

    @ExceptionHandler(SubmissionNotFoundException.class)
    public ResponseEntity<Void> handleSubmissionNotFoundException() {
        return ResponseEntity.notFound().build();
    }

    @ExceptionHandler(UnansweredQuestionsException.class)
    public ResponseEntity<Map<String, String>> handleUnansweredQuestionsException(
            UnansweredQuestionsException exception
    ) {
        return ResponseEntity.badRequest().body(
                Map.of("error", exception.getMessage())
        );
    }

    @ExceptionHandler(QuestionAlreadyAnsweredException.class)
    public ResponseEntity<Map<String, String>> handleQuestionAlreadyAnsweredException(
            QuestionAlreadyAnsweredException exception
    ) {
        return ResponseEntity.badRequest().body(
                Map.of("error", exception.getMessage())
        );
    }

    @ExceptionHandler(AnswerNotInQuizException.class)
    public ResponseEntity<Map<String, String>> handleAnswerNotInQuizException(
            AnswerNotInQuizException exception
    ) {
        return ResponseEntity.badRequest().body(
                Map.of("error", exception.getMessage())
        );
    }

    @ExceptionHandler(AnswerNotInQuestionException.class)
    public ResponseEntity<Map<String, String>> handleAnswerNotInQuestionException(
            AnswerNotInQuestionException exception
    ) {
        return ResponseEntity.badRequest().body(
                Map.of("error", exception.getMessage())
        );
    }

    @ExceptionHandler(StudentProgressionNotFoundException.class)
    public ResponseEntity<Map<String, String>> StudentProgressionNotFoundException(
            StudentProgressionNotFoundException exception
    ) {
        return ResponseEntity.badRequest().body(
                Map.of("error", exception.getMessage())
        );
    }
}
