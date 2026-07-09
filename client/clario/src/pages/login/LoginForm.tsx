import { useState } from 'react';
import "../../App.css";
import InputField from '../../components/inputField/InputField';
import UserService from '../../api/UserService';
import SubmitButton from '../../components/submitButton/SubmitButton';
import type { UserLogin } from '../../api/types/User';
import axios from "axios";
import { useNavigate } from "react-router-dom";

function LoginForm() {
    const [formData, setFormData] = useState<UserLogin>({
      username: '',
      password: '',
    });
    
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setErrorMessage(null);

      try {
        await UserService.loginUser(formData);
        console.log("Login successful! Token is saved.");
        navigate('/home'); 
        
      } catch (error: any) {
          const message = axios.isAxiosError(error)
            ? error.response?.data?.message ?? "Wrong username or password"
            : "An unexpected error occurred";

          console.error("Login failed:", error);
          setErrorMessage(message);
      }
    };

    return (
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm ">
            <h1 className="font-bold text-6xl mb-16 text-center ">
              Login
            </h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <InputField
              label="Username"
              id="username"
              type="text"
              placeholder="Enter your username"
              value={formData.username}
              onChange={(value) => setFormData({ ...formData, username: value })}
            />
            <InputField
              label="Password"
              id="Password"
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={(value) => setFormData({ ...formData, password: value })}
            />
            <SubmitButton type='submit'>Submit</SubmitButton>
          </form>

          {/* Vypísanie chybovej hlášky, ak login zlyhal */}
          {errorMessage && (
            <div className="mt-4 text-red-500 text-center font-semibold">
              <p>{errorMessage}</p>
            </div>
          )}
        </div>
    );
}

export default LoginForm;