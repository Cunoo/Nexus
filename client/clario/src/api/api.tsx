import axios from 'axios';
import { API_BACKEND_URL } from '../../api_list';

const API_URL = API_BACKEND_URL;

export const api = axios.create({
    baseURL: API_URL
});

// REQUEST INTERCEPTOR: Automatically adds the JWT token to the Authorization header for all requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

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
