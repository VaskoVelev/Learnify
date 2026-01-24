import http from "../lib/http";

export const createQuestion = async (id, data) => {
    const response = await http.post(`/quizzes/${id}/questions`, data);
    return response.data;
};

export const getQuizQuestions = async (id) => {
    const response = await http.get(`/quizzes/${id}/questions`);
    return response.data;
};

export const updateQuestion = async (id, data) => {
    const response = await http.put(`/questions/${id}`, data);
    return response.data;
};

export const deleteQuestion = async (id) => {
    await http.delete(`/questions/${id}`);
};
