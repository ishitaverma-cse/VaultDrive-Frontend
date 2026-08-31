import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

export function loginUser(data) {
    return axios.post(`${BASE_URL}/api/auth/login`, data);
}

export function registerUser(data) {
    return axios.post(`${BASE_URL}/api/auth/register`, data);
}

export function getFiles() {
    const token = localStorage.getItem("token");

    return axios.get(`${BASE_URL}/api/files`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
}

export function getFolders() {
    const token = localStorage.getItem("token");

    return axios.get(`${BASE_URL}/api/folders`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
}