import React, { useState, useEffect, useRef } from 'react';
import Button from "../components/submitButton/SubmitButton";
import Avatar from '../components/avatar/Avatar';
import UserService from '../api/UserService'; 
import HomePage from './home/HomePage';
import { useTranslation } from 'react-i18next';

const Header: React.FC = () => {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const { t } = useTranslation();

    useEffect(() => {
        setIsLoggedIn(!!localStorage.getItem('token'));
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <header className="bg-white shadow-md py-4 px-8 flex justify-between items-center relative z-50"> 
            <div className="flex items-center gap-8">
                <h1 className="text-blue-600 text-2xl font-extrabold whitespace-nowrap">{t("header.name")}</h1>
                
                <nav className="flex gap-4 items-center">
                    <a href="/">
                        <Button>{t("buttons.home")}</Button>
                    </a>
                    <Button>{t("buttons.about")}</Button>
                    <Button>{t("buttons.contact")}</Button>
                </nav>
            </div>
            <div className="flex items-center">
                {isLoggedIn ? (
                    <div className="flex items-center gap-4" ref={dropdownRef}>
                        <a href="/user/dashboard">
                            <Button>{t("buttons.dashboard")}</Button>
                        </a>
                        <button 
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="focus:outline-none block hover:opacity-90 transition-opacity"
                        >
                            <Avatar name="User" size="md" />
                        </button>

                        {/* Dropdown Menu */}
                        {isDropdownOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-1">
                                <a
                                    href="/edit-profile"
                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                                >
                                    {t("buttons.editProfile")}
                                </a>
                                <button
                                    onClick={() => UserService.logoutUser()}
                                    className="w-full text-left block px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors font-semibold"
                                >
                                    {t("buttons.logout")}
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <Button onClick={() => window.location.href = '/auth/login'}>
                        {t("buttons.login")}
                    </Button>
                )}
            </div>

        </header>
    );
};

export default Header;