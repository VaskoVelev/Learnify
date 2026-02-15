import http from "../lib/http";
import { API_PATHS } from "../constants";

export const createQuestion = async (id, data) => {
    const response = await http.post(API_PATHS.QUIZ_QUESTIONS(id), data);
    return response.data;
};

export const getQuizQuestions = async (id) => {
    const response = await http.get(API_PATHS.QUIZ_QUESTIONS(id));
    return response.data;
};

export const updateQuestion = async (id, data) => {
    const response = await http.put(API_PATHS.QUESTION_BY_ID(id), data);
    return response.data;
};

export const deleteQuestion = async (id) => {
    await http.delete(API_PATHS.QUESTION_BY_ID(id));
};