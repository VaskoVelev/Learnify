import http from "./http";

export const createMaterial = async (id, data) => {
    const response = await http.post(`/lessons/${id}/materials`, data);
    return response.data;
};

export const getLessonMaterials = async (id) => {
    const response = await http.get(`/lessons/${id}/materials`);
    return response.data;
};

export const updateMaterial = async (id, data) => {
    const response = await http.put(`/materials/${id}`, data);
    return response.data;
};

export const deleteMaterial = async (id) => {
    await http.delete(`/materials/${id}`);
};
