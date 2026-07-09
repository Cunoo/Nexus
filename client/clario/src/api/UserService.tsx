// src/services/UserService.ts
import { api } from './api';
import type { UserCreate, UserLogin, AuthResponse } from "./types/User";

class UserService {
    async registerUser(data: UserCreate): Promise<void> {
        const response = await api.post<AuthResponse>('/auth/register', data);
        if (response.data?.token) localStorage.setItem('token', response.data.token);
    }

    async loginUser(data: UserLogin): Promise<void> {
        const response = await api.post<AuthResponse>('/auth/login', data);
        if (response.data?.token) localStorage.setItem('token', response.data.token);
    }

    logoutUser(): void {
        localStorage.removeItem('token');
        window.location.href = '/login';
    }
}

export default new UserService();