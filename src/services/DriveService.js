import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

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

export function createFolder(data) {
    const token = localStorage.getItem("token");

    return axios.post(`${BASE_URL}/api/folders`, data, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
}

export function updateFile(fileId, data) {
    const token = localStorage.getItem("token");

    return axios.post(`${BASE_URL}/api/files/${fileId}/update`, data, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
}

export function uploadFile(file) {
    const token = localStorage.getItem("token");

    const formData = new FormData();
    formData.append("file", file);

    return axios.post(`${BASE_URL}/api/files/upload`, formData, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
}

export function searchFiles(query) {
    const token = localStorage.getItem("token");

    return axios.get(`${BASE_URL}/api/files/search`, {
        params: {
            q: query
        },
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
}

export function deleteFile(fileId) {
    const token = localStorage.getItem("token");

    return axios.post(`${BASE_URL}/api/files/${fileId}/delete`, null, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
}

export function renameFile(fileId, name) {
    const token = localStorage.getItem("token");

    return axios.post(`${BASE_URL}/api/files/${fileId}/rename`, { name }, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
}