import http from "../lib/http";

export const createQuiz = async (id, data) => {
    const response = await http.post(`/courses/${id}/quizzes`, data);
    return response.data;
};

export const getCourseQuizzes = async (id) => {
    const response = await http.get(`/courses/${id}/quizzes`);
    return response.data;
};

export const getQuiz = async (id) => {
    const response = await http.get(`/quizzes/${id}`);
    return response.data;
};

export const updateQuiz = async (id, data) => {
    const response = await http.put(`/quizzes/${id}`, data);
    return response.data;
};

export const deleteQuiz = async (id) => {
    await http.delete(`/quizzes/${id}`);
};
