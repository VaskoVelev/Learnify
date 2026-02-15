import http from "../lib/http";
import { API_PATHS } from "../constants";

export const login = async (data) => {
    return await http.post(API_PATHS.AUTH_LOGIN, data);
};

export const refresh = async () => {
    return await http.post(API_PATHS.AUTH_REFRESH);
};

export const logout = async () => {
    return await http.post(API_PATHS.AUTH_LOGOUT);
};