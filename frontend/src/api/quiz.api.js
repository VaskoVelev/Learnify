import http from "../lib/http";
import { API_PATHS } from "../constants";

export const createQuiz = async (id, data) => {
    const response = await http.post(API_PATHS.LESSON_QUIZZES(id), data);
    return response.data;
};

export const getLessonQuizzes = async (id) => {
    const response = await http.get(API_PATHS.LESSON_QUIZZES(id));
    return response.data;
};

export const getQuiz = async (id) => {
    const response = await http.get(API_PATHS.QUIZ_BY_ID(id));
    return response.data;
};

export const updateQuiz = async (id, data) => {
    const response = await http.put(API_PATHS.QUIZ_BY_ID(id), data);
    return response.data;
};

export const deleteQuiz = async (id) => {
    await http.delete(API_PATHS.QUIZ_BY_ID(id));
};