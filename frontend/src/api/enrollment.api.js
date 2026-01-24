import http from "./http";

export const enrollInCourse = async (id) => {
    const response = await http.post(`/courses/${id}/enroll`);
    return response.data;
};

export const getMyEnrollments = async () => {
    const response = await http.get("/enrollments/me");
    return response.data;
};

export const getCourseEnrollments = async (id) => {
    const response = await http.get(`/courses/${id}/enrollments`);
    return response.data;
};

export const getAllEnrollments = async () => {
    const response = await http.get("/enrollments");
    return response.data;
};
