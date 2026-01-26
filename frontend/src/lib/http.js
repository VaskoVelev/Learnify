import axios from "axios";
import { normalizeError } from "./error";

const http = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json"
    },
});

http.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("accessToken");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(normalizeError(error))
);

http.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        const status = error.response?.status;

        if (originalRequest.url.includes("/auth/refresh")) {
            localStorage.removeItem("accessToken");
            return Promise.reject(normalizeError(error));
        }

        if (status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const response = await http.post("/auth/refresh");
                const newAccessToken = await response.data.token;

                localStorage.setItem("accessToken", newAccessToken);
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

                return http(originalRequest);
            } catch (refreshError) {
                localStorage.removeItem("accessToken");
                return Promise.reject(normalizeError(error));
            }
        }

        return Promise.reject(normalizeError(error));
    }
);

export default http;
