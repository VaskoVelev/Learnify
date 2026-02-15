import http from "../lib/http";
import { API_PATHS } from "../constants";

export const createCourse = async (data) => {
    const response = await http.post(API_PATHS.COURSES, data);
    return response.data;
};

export const getAllCourses = async () => {
    const response = await http.get(API_PATHS.COURSES);
    return response.data;
};

export const getCourse = async (id) => {
    const response = await http.get(API_PATHS.COURSE_BY_ID(id));
    return response.data;
};

export const getMyCoursesCreated = async () => {
    const response = await http.get(API_PATHS.COURSES_CREATED_ME);
    return response.data;
};

export const getMyProgression = async (id) => {
    const response = await http.get(API_PATHS.COURSE_PROGRESSION_ME(id));
    return response.data;
};

export const getCourseProgressions = async (id) => {
    const response = await http.get(API_PATHS.COURSE_PROGRESSIONS(id));
    return response.data;
};

export const updateCourse = async (id, data) => {
    const response = await http.put(API_PATHS.COURSE_BY_ID(id), data);
    return response.data;
};

export const deleteCourse = async (id) => {
    await http.delete(API_PATHS.COURSE_BY_ID(id));
};