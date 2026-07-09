// src/types/User.ts
export interface UserCreate {
  username: string;
  password: string;
  email: string;
}

export interface UserResponse {
  id: number;
  username: string;
  email: string;
}

export interface UserLogin {
  username: string;
  password: string;
}

export interface AuthResponse {
    token: string;
}