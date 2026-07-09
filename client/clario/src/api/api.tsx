// src/services/api.ts
import axios from 'axios';
import { API_BACKEND_URL } from '../../api_list';

const API_URL = API_BACKEND_URL;

export const api = axios.create({
    baseURL: API_URL
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            console.warn("Token expired or invalid. Redirecting to login...");
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export async function getProtectedData<T>(endpoint: string): Promise<T> {
    const token = localStorage.getItem('token');
    
    if (!token) {
        throw new Error("No token found!");
    }

    const response = await api.get<T>(endpoint, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data;
}