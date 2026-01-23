package com.vvelev.learnify.exceptions;

public class QuestionAlreadyAnsweredException extends RuntimeException {
    public QuestionAlreadyAnsweredException() {
        super("Question is already answered");
    }
}
