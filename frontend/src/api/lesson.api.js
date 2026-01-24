import http from "../lib/http";

export const createLesson = async (id, data) => {
    const response = await http.post(`/courses/${id}/lessons`, data);
    return response.data;
};

export const getCourseLessons = async (id) => {
    const response = await http.get(`/courses/${id}/lessons`);
    return response.data;
};

export const getLesson = async (id) => {
    const response = await http.get(`/lessons/${id}`);
    return response.data;
};

export const updateLesson = async (id, data) => {
    const response = await http.put(`/lessons/${id}`, data);
    return response.data;
};

export const deleteLesson = async (id) => {
    await http.delete(`/lessons/${id}`);
};
