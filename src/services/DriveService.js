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

export function renameFolder(folderId, name) {
    const token = localStorage.getItem("token");

    return axios.post(
        `${BASE_URL}/api/folders/${folderId}/rename`,
        { name },
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );
}

export function deleteFolder(folderId) {
    const token = localStorage.getItem("token");

    return axios.post(
        `${BASE_URL}/api/folders/${folderId}/delete`,
        null,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );
}

export function updateFile(fileId, data) {
    const token = localStorage.getItem("token");

    return axios.post(`${BASE_URL}/api/files/${fileId}/update`, data, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
}

export function uploadFile(file, onUploadProgress) {
    const token = localStorage.getItem("token");

    const formData = new FormData();
    formData.append("file", file);

    return axios.post(`${BASE_URL}/api/files/upload`, formData, {
        headers: {
            Authorization: `Bearer ${token}`
        },
        onUploadProgress
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

export function getSignedUrl(fileId) {
    const token = localStorage.getItem("token");

    return axios.post(
        `${BASE_URL}/api/files/${fileId}/signed-url`,
        {},
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );
}

export function createShareLink(fileId) {
    const token = localStorage.getItem("token");

    return axios.post(
        `${BASE_URL}/api/share/${fileId}`,
        {},
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );
}

export function setFilePermission(fileId, email, role) {
    const token = localStorage.getItem("token");

    return axios.post(
        `${BASE_URL}/api/permissions/${fileId}`,
        {
            email,
            role
        },
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );
}

export function getTrash() {
    const token = localStorage.getItem("token");

    return axios.post(
        `${BASE_URL}/api/trash`,
        {},
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );
}

export function restoreTrash(type, itemId) {
    const token = localStorage.getItem("token");

    return axios.post(
        `${BASE_URL}/api/trash/${type}/${itemId}/restore`,
        {},
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );
}

export function permanentlyDeleteItem(type, itemId) {
    const token = localStorage.getItem("token");

    return axios.delete(
        `${BASE_URL}/api/trash/${type}/${itemId}/permanent`,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );
}

export function toggleStarFile(fileId) {
    const token = localStorage.getItem("token");

    return axios.post(
        `${BASE_URL}/api/files/${fileId}/star`,
        {},
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );
}

export function getStarredFiles() {
    const token = localStorage.getItem("token");

    return axios.get(
        `${BASE_URL}/api/files/starred`,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );
}