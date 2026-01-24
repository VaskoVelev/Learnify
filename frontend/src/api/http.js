import axios from "axios";

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
    (error) => Promise.reject(error)
);

http.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        const status = error.response?.status;
        const data = error.response?.data;

        if (status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const response = await http.post("/auth/refresh");
                const newAccessToken = await response.data.accessToken;

                localStorage.setItem("accessToken", newAccessToken);
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

                return http(originalRequest);
            } catch (refreshError) {
                localStorage.removeItem("accessToken");
                window.location.href = "/login";
                return Promise.reject(error);
            }
        }

        if (status === 403) {
            alert(data?.message || "Access denied");
            return Promise.reject(error);
        }

        if (status === 400 || status === 404) {
            alert(data?.message || "Bad Request");
            return Promise.reject(error);
        }

        if (status >= 500) {
            alert("Server error. Please try again later.");
            return Promise.reject(error);
        }

        alert("Unexpected error");
        return Promise.reject(error);
    }
);

export default http;
