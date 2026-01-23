package com.vvelev.learnify.exceptions;

public class AnswerNotInQuizException extends RuntimeException {
    public AnswerNotInQuizException() {
        super("Answer is not in the quiz");
    }
}
