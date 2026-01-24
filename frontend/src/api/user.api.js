import http from "./http";

export const registerUser = async (data) => {
    const response = await http.post("/users", data);
    return response.data;
};

export const getAllUsers = async () => {
    const response = await http.get("/users");
    return response.data;
};

export const getUser = async (id) => {
    const response = await http.get(`/users/${id}`);
    return response.data;
};

export const getMe = async () => {
    const response = await http.get("/me");
    return response.data;
};

export const updateUser = async (id, data) => {
    const response = await http.put(`/users/${id}`, data);
    return response.data;
};

export const updateMe = async (data) => {
    const response = await http.put("/me", data);
    return response.data;
};

export const deleteMe = async () => {
    await http.delete("/me");
};
