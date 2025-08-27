import React from "react";
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav className="bg-white shadow px-4 py-3 flex justify-between items-center">
            <Link to="/" className="text-xl font-bold text-blue-600">HeadHunter</Link>
            <div className="space-x-4">
                <Link to="/login" className="text-gray-600 hover:text-blue-600">Login</Link>
                <Link to="/register" className="text-gray-600 hover:text-blue-600">Register</Link>
            </div>
        </nav>
    );
};

export default Navbar;
