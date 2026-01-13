package com.vvelev.learnify.exceptions;

public class UnansweredQuestionsException extends RuntimeException {
    public UnansweredQuestionsException() {
        super("Answer all of the questions");
    }
}
