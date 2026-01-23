package com.vvelev.learnify.exceptions;

public class StudentProgressionNotFoundException extends RuntimeException {
    public StudentProgressionNotFoundException() {
        super("Student has no progression in this course");
    }
}
