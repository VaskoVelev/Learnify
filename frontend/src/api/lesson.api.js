import http from "../lib/http";
import { API_PATHS } from "../constants";

export const createLesson = async (id, data) => {
    const response = await http.post(API_PATHS.COURSE_LESSONS(id), data);
    return response.data;
};

export const getCourseLessons = async (id) => {
    const response = await http.get(API_PATHS.COURSE_LESSONS(id));
    return response.data;
};

export const getLesson = async (id) => {
    const response = await http.get(API_PATHS.LESSON_BY_ID(id));
    return response.data;
};

export const updateLesson = async (id, data) => {
    const response = await http.put(API_PATHS.LESSON_BY_ID(id), data);
    return response.data;
};

export const deleteLesson = async (id) => {
    await http.delete(API_PATHS.LESSON_BY_ID(id));
};