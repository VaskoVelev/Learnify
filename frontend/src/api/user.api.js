import http from "../lib/http";
import { API_PATHS } from "../constants";

export const registerUser = async (data) => {
    const response = await http.post(API_PATHS.USERS, data);
    return response.data;
};

export const getAllUsers = async () => {
    const response = await http.get(API_PATHS.USERS);
    return response.data;
};

export const getUser = async (id) => {
    const response = await http.get(API_PATHS.USER_BY_ID(id));
    return response.data;
};

export const getMe = async () => {
    const response = await http.get(API_PATHS.ME);
    return response.data;
};

export const updateUser = async (id, data) => {
    const response = await http.put(API_PATHS.USER_BY_ID(id), data);
    return response.data;
};

export const updateMe = async (data) => {
    const response = await http.put(API_PATHS.ME, data);
    return response.data;
};

export const deleteMe = async () => {
    await http.delete(API_PATHS.ME);
};