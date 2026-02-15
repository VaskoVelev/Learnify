import http from "../lib/http";
import { API_PATHS } from "../constants";

export const submitQuiz = async (id, data) => {
    const response = await http.post(API_PATHS.QUIZ_SUBMIT(id), data);
    return response.data;
};

export const getQuizSubmissions = async (id) => {
    const response = await http.get(API_PATHS.QUIZ_SUBMISSIONS(id));
    return response.data;
};

export const getMyQuizSubmissions = async (id) => {
    const response = await http.get(API_PATHS.QUIZ_SUBMISSIONS_ME(id));
    return response.data;
};

export const getSubmission = async (id) => {
    const response = await http.get(API_PATHS.SUBMISSION_BY_ID(id));
    return response.data;
};