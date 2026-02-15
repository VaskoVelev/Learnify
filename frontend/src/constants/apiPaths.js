export const API_PATHS = {
    // Auth
    AUTH_LOGIN: '/auth/login',
    AUTH_REFRESH: '/auth/refresh',
    AUTH_LOGOUT: '/auth/logout',

    // Users
    USERS: '/users',
    USER_BY_ID: (id) => `/users/${id}`,
    ME: '/me',

    // Courses
    COURSES: '/courses',
    COURSE_BY_ID: (id) => `/courses/${id}`,
    COURSES_CREATED_ME: '/courses-created/me',

    // Enrollments
    ENROLLMENTS: '/enrollments',
    ENROLLMENTS_ME: '/enrollments/me',
    COURSE_ENROLLMENTS: (id) => `/courses/${id}/enrollments`,
    COURSE_ENROLL: (id) => `/courses/${id}/enroll`,

    // Lessons
    LESSONS: '/lessons',
    LESSON_BY_ID: (id) => `/lessons/${id}`,
    COURSE_LESSONS: (id) => `/courses/${id}/lessons`,

    // Materials
    MATERIALS: '/materials',
    MATERIAL_BY_ID: (id) => `/materials/${id}`,
    LESSON_MATERIALS: (id) => `/lessons/${id}/materials`,

    // Quizzes
    QUIZZES: '/quizzes',
    QUIZ_BY_ID: (id) => `/quizzes/${id}`,
    LESSON_QUIZZES: (id) => `/lessons/${id}/quizzes`,

    // Questions
    QUESTIONS: '/questions',
    QUESTION_BY_ID: (id) => `/questions/${id}`,
    QUIZ_QUESTIONS: (id) => `/quizzes/${id}/questions`,

    // Answers
    ANSWERS: '/answers',
    ANSWER_BY_ID: (id) => `/answers/${id}`,
    QUESTION_ANSWERS: (id) => `/questions/${id}/answers`,

    // Submissions
    SUBMISSIONS: '/submissions',
    SUBMISSION_BY_ID: (id) => `/submissions/${id}`,
    QUIZ_SUBMIT: (id) => `/quizzes/${id}/submit`,
    QUIZ_SUBMISSIONS: (id) => `/quizzes/${id}/submissions`,
    QUIZ_SUBMISSIONS_ME: (id) => `/quizzes/${id}/submissions/me`,

    // Progressions
    COURSE_PROGRESSIONS: (id) => `/courses/${id}/progressions`,
    COURSE_PROGRESSION_ME: (id) => `/courses/${id}/progression/me`,
};