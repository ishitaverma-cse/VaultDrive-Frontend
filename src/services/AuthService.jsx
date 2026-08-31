import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

export function loginUser(data) {
    return axios.post(`${BASE_URL}/api/auth/login`, data);
}

export function registerUser(data) {
    return axios.post(`${BASE_URL}/api/auth/register`, data);
}