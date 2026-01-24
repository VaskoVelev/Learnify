import http from "../lib/http";

export const submitQuiz = async (id, data) => {
    const response = await http.post(`/quizzes/${id}/submit`, data);
    return response.data;
};

export const getQuizSubmissions = async (id) => {
    const response = await http.get(`/quizzes/${id}/submissions`);
    return response.data;
};

export const getMyQuizSubmissions = async (id) => {
    const response = await http.get(`/quizzes/${id}/submissions/me`);
    return response.data;
};

export const getSubmission = async (id) => {
    const response = await http.get(`/submissions/${id}`);
    return response.data;
};
