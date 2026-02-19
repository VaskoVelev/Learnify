import http from "../lib/http";
import { API_PATHS } from "../constants";

export const enrollInCourse = async (id) => {
    const response = await http.post(API_PATHS.COURSE_ENROLL(id));
    return response.data;
};

export const getMyEnrollments = async () => {
    const response = await http.get(API_PATHS.ENROLLMENTS_ME);
    return response.data;
};

export const getCourseEnrollments = async (id) => {
    const response = await http.get(API_PATHS.COURSE_ENROLLMENTS(id));
    return response.data;
};

export const getAllEnrollments = async () => {
    const response = await http.get(API_PATHS.ENROLLMENTS);
    return response.data;
};

export const deleteEnrollment = async (studentId, courseId) => {
    const response = await http.delete(API_PATHS.ENROLLMENT_BY_ID(studentId, courseId));
    return response.data;
};