import React from 'react';
import Button from "../components/submitButton/SubmitButton";// Predpokladám, že komponent Button máš importovaný odtiaľto

const Header: React.FC = () => {
    return (
        <header className="bg-white shadow-md py-4 px-8 flex justify-between items-center"> 
        <h1 className="text-blue-600 text-2xl font-extrabold">Nexus AI</h1>
        <nav className="flex gap-4">
            <Button>Home</Button>
            <Button>About</Button>
            <Button>Contact</Button>
            <Button>My Profile</Button>
        </nav>
        </header>
    );
    };

export default Header;