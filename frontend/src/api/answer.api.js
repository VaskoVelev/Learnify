import http from "./http";

export const createAnswer = async (id, data) => {
    const response = await http.post(`/questions/${id}/answers`, data);
    return response.data;
};

export const getQuestionAnswers = async (id) => {
    const response = await http.get(`/questions/${id}/answers`);
    return response.data;
};

export const updateAnswer = async (id, data) => {
    const response = await http.put(`/answers/${id}`, data);
    return response.data;
};

export const deleteAnswer = async (id) => {
    await http.delete(`/answers/${id}`);
};
