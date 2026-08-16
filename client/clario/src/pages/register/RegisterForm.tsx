import { useState } from 'react';
import "../../App.css";
import InputField from '../../components/inputField/InputField';
import UserService from '../../api/UserService';
import SubmitButton from '../../components/submitButton/SubmitButton';
import type { UserCreate } from '../../api/types/User';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';

function RegisterForm() {
    const [formData, setFormData] = useState<UserCreate>({
      username: '',
      password: '',
      email: '',
    });
    const { t } = useTranslation();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setErrorMessage(null);

      try {
        await UserService.registerUser(formData);
        console.log("Registration and login successful");
        navigate('/home');
        
      } catch (error: any) {
          const message = axios.isAxiosError(error)
            ? error.response?.data?.message ?? "Registration failed. Try a different username or email."
            : "An unexpected error occurred";

          console.error("Registration failed:", error);
          setErrorMessage(message);
      }
    };

    return (
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm ">
            <h1 className="font-bold text-6xl mb-16 text-center ">
              {t("buttons.register")}
            </h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* InputField for Username */}
            <InputField
              label={t("inputs.username")}
              id="username"
              type="text"
              placeholder={t("placeholders.username")}
              value={formData.username}
              onChange={(value) => setFormData({ ...formData, username: value })}
            />
            {/* InputField for Email */}
            <InputField
              label={t("inputs.email")}
              id="email"
              type="email"
              placeholder={t("placeholders.email")}
              value={formData.email}
              onChange={(value) => setFormData({ ...formData, email: value })}
            />
            {/* InputField for Password */}
            <InputField
              label={t("inputs.password")}
              id="Password"
              type="password"
              placeholder={t("placeholders.password")}
              value={formData.password}
              onChange={(value) => setFormData({ ...formData, password: value })}
            />
            <SubmitButton type='submit'>{t("buttons.submit")}</SubmitButton>
          </form>

          {/* Opravené vypisovanie chybovej hlášky */}
          {errorMessage && (
            <div className="mt-4 text-red-500 text-center font-semibold">
              <p>{errorMessage}</p>
            </div>
          )}
        </div>
    );
}

export default RegisterForm;