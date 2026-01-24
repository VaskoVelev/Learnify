import http from "../lib/http";

export const createCourse = async (data) => {
    const response = await http.post("/courses", data);
    return response.data;
};

export const getAllCourses = async () => {
    const response = await http.get("/courses");
    return response.data;
};

export const getCourse = async (id) => {
    const response = await http.get(`/courses/${id}`);
    return response.data;
};

export const getMyCoursesCreated = async () => {
    const response = await http.get("/courses-created/me");
    return response.data;
};

export const getMyProgression = async (id) => {
    const response = await http.get(`/courses/${id}/progression/me`);
    return response.data;
};

export const getCourseProgressions = async (id) => {
    const response = await http.get(`/courses/${id}/progressions`);
    return response.data;
};

export const updateCourse = async (id, data) => {
    const response = await http.put(`/courses/${id}`, data);
    return response.data;
};

export const deleteCourse = async (id) => {
    await http.delete(`/courses/${id}`);
};
