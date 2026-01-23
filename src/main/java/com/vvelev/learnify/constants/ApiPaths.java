package com.vvelev.learnify.constants;

import lombok.NoArgsConstructor;

@NoArgsConstructor
public final class ApiPaths {
    public static final String API_BASE = "/api";

    public static final String AUTH = API_BASE + "/auth";
    public static final String AUTH_LOGIN = AUTH + "/login";
    public static final String AUTH_REFRESH = AUTH + "/refresh";
    public static final String AUTH_LOGOUT = AUTH + "/logout";

    public static final String USERS = API_BASE + "/users";
    public static final String USER_BY_ID = USERS + "/{id}";
    public static final String ME = API_BASE + "/me";

    public static final String COURSES = API_BASE + "/courses";
    public static final String COURSE_BY_ID = COURSES + "/{id}";
    public static final String COURSES_CREATED_ME = COURSES + "-created/me";

    public static final String ENROLLMENTS = API_BASE + "/enrollments";
    public static final String ENROLLMENTS_ME = ENROLLMENTS + "/me";
    public static final String COURSE_ENROLLMENTS = COURSES + "/{id}/enrollments";
    public static final String COURSE_ENROLL = COURSES + "/{id}/enroll";

    public static final String LESSONS = API_BASE + "/lessons";
    public static final String LESSON_BY_ID = LESSONS + "/{id}";
    public static final String COURSE_LESSONS = COURSES + "/{id}/lessons";

    public static final String MATERIALS = API_BASE + "/materials";
    public static final String MATERIAL_BY_ID = MATERIALS + "/{id}";
    public static final String LESSON_MATERIALS = LESSONS + "/{id}/materials";

    public static final String QUIZZES = API_BASE + "/quizzes";
    public static final String QUIZ_BY_ID = QUIZZES + "/{id}";
    public static final String COURSE_QUIZZES = COURSES + "/{id}/quizzes";

    public static final String QUESTIONS = API_BASE + "/questions";
    public static final String QUESTION_BY_ID = QUESTIONS + "/{id}";
    public static final String QUIZ_QUESTIONS = QUIZZES + "/{id}/questions";

    public static final String ANSWERS = API_BASE + "/answers";
    public static final String ANSWER_BY_ID = ANSWERS + "/{id}";
    public static final String QUESTION_ANSWERS = QUESTIONS + "/{id}/answers";

    public static final String SUBMISSIONS = API_BASE + "/submissions";
    public static final String SUBMISSION_BY_ID = SUBMISSIONS + "/{id}";
    public static final String QUIZ_SUBMIT = QUIZZES + "/{id}/submit";
    public static final String QUIZ_SUBMISSIONS = QUIZZES + "/{id}/submissions";
    public static final String QUIZ_SUBMISSIONS_ME = QUIZ_SUBMISSIONS + "/me";

    public static final String COURSE_PROGRESSIONS = COURSES + "/{id}/progressions";
    public static final String COURSE_PROGRESSION_ME = COURSES + "/{id}/progression/me";
}
