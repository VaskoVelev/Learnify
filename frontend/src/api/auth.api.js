import http from "../lib/http";

export const login = async (data) => {
    return await http.post("/auth/login", data);
};

export const refresh = async () => {
    return await http.post("/auth/refresh");
};

export const logout = async () => {
    return await http.post("/auth/logout");
};
