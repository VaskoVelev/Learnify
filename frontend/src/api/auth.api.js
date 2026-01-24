import http from "../lib/http";

export const login = (data) => {
    return http.post("/auth/login", data);
};

export const refresh = () => {
    return http.post("/auth/refresh");
};

export const logout = () => {
    return http.post("/auth/logout");
};
