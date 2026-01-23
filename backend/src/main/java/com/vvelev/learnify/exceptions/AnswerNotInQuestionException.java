package com.vvelev.learnify.exceptions;

public class AnswerNotInQuestionException extends RuntimeException {
    public AnswerNotInQuestionException() {
        super("Answer is not in the question");
    }
}
