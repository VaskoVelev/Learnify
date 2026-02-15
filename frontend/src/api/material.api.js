import http from "../lib/http";
import { API_PATHS } from "../constants";

export const createMaterial = async (id, data) => {
    const response = await http.post(API_PATHS.LESSON_MATERIALS(id), data);
    return response.data;
};

export const getLessonMaterials = async (id) => {
    const response = await http.get(API_PATHS.LESSON_MATERIALS(id));
    return response.data;
};

export const updateMaterial = async (id, data) => {
    const response = await http.put(API_PATHS.MATERIAL_BY_ID(id), data);
    return response.data;
};

export const deleteMaterial = async (id) => {
    await http.delete(API_PATHS.MATERIAL_BY_ID(id));
};