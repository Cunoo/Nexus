import React, { useState, useEffect, useRef } from 'react';
import Button from "../components/submitButton/SubmitButton";
import Avatar from '../components/avatar/Avatar';
import UserService from '../api/UserService'; 
import HomePage from './home/HomePage';

const Header: React.FC = () => {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

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
                <h1 className="text-blue-600 text-2xl font-extrabold whitespace-nowrap">Nexus AI</h1>
                
                <nav className="flex gap-4 items-center">
                    <a href="/">
                        <Button>Home</Button>
                    </a>
                    <Button>About</Button>
                    <Button>Contact</Button>
                </nav>
            </div>
            <div className="flex items-center">
                {isLoggedIn ? (
                    <div className="flex items-center gap-4" ref={dropdownRef}>
                        <a href="/user/dashboard">
                            <Button>Dashboard</Button>
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
                                    Edit Profile
                                </a>
                                <button
                                    onClick={() => UserService.logoutUser()}
                                    className="w-full text-left block px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors font-semibold"
                                >
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <Button onClick={() => window.location.href = '/auth/login'}>
                        Login
                    </Button>
                )}
            </div>

        </header>
    );
};

export default Header;