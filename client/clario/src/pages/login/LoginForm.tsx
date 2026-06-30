  import { useState, useEffect} from 'react'
  import "../../App.css";
  import InputField from '../../components/inputField/InputField';
  import UserService from '../../api/UserService';
  import SubmitButton from '../../components/submitButton/SubmitButton'
  import type { UserCreate, UserLogin, UserResponse } from '../../api/types/User';
  import axios from "axios";
  import {useNavigate} from "react-router-dom";

  function LoginForm() {
      const [formData, setFormData] = useState<UserLogin>({
        username: '',
        password: '',
      })
      const [user, setUser] = useState<UserResponse | null>(null);
      const [errorMessage, setErrorMessage] = useState<string | null>(null);
      const [isAuthenticated, setisAuthenticated] = useState<boolean>(false);
      const navigate = useNavigate();



      const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try{
          const result: UserResponse = await UserService.loginUser(formData);
          console.log("login successful", result);
          setUser(result);
          setisAuthenticated(true);
        } catch (error:any) {
            const message = axios.isAxiosError(error)
              ? error.response?.data?.message ?? error.message
              : "An unexpected error occurred";

            console.error("Login failed:", error);
            setErrorMessage(message);
            setUser(null)
        }

      };
      return (
          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm ">
              <h1 className="font-bold text-6xl mb-16 text-center ">
                Login
              </h1>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* InputField for Username */}
              <InputField
                label="Username"
                id="username"
                type="text"
                placeholder="Enter your username"
                value={formData.username}
                onChange={(value) => setFormData({ ...formData, username: value })}
              />
              {/* InputField for Password */}
              <InputField
                label="Password"
                id="Password"
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={(value) => setFormData({ ...formData, password: value })}
              ></InputField>
              <SubmitButton type='submit'>Submit</SubmitButton>
            </form>
            {/* Ukážka registrovaného používateľa */}
            {user && (
              <div className="mt-4">
                <p>Logged in user ID: {user.id}</p>
                <p>Username: {user.username}</p>
              </div>
            )}
            {/* Ukážka registrovaného používateľa */}
              {errorMessage && (
                <div className="mt-4">
                  <p>{errorMessage}</p>
                </div>
              )}
          </div>
      )
  }

  export default LoginForm;
