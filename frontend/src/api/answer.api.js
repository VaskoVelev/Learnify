import http from "../lib/http";
import { API_PATHS } from "../constants";

export const createAnswer = async (id, data) => {
    const response = await http.post(API_PATHS.QUESTION_ANSWERS(id), data);
    return response.data;
};

export const getQuestionAnswers = async (id) => {
    const response = await http.get(API_PATHS.QUESTION_ANSWERS(id));
    return response.data;
};

export const updateAnswer = async (id, data) => {
    const response = await http.put(API_PATHS.ANSWER_BY_ID(id), data);
    return response.data;
};

export const deleteAnswer = async (id) => {
    await http.delete(API_PATHS.ANSWER_BY_ID(id));
};