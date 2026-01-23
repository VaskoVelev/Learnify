package com.vvelev.learnify.exceptions;

public class StudentAlreadyEnrolledException extends RuntimeException {
    public StudentAlreadyEnrolledException() {
        super("Student is already enrolled in this course");
    }
}
