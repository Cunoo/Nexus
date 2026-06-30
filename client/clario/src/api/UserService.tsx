
import axios from 'axios';
import type {UserCreate, UserLogin, UserResponse} from "./types/User";
import { API_BACKEND_URL } from '../../api_list';
const API_URL = API_BACKEND_URL;
class UserService {

    async registerUser(data: UserCreate): Promise<UserResponse> {
        const response = await axios.post<UserResponse>(`${API_URL}/auth/register`, data);
        console.log("response", response)
        return response.data // parsed JSON response
    }
    async loginUser(data: UserLogin): Promise<UserResponse> {
        const response = await axios.post<UserResponse>(`${API_URL}/auth/login`, data);
        console.log("response", response)
        return response.data // parsed JSON response
    }
}

export default new UserService();