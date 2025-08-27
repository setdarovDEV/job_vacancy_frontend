import React from "react";
import Navbar from './Navbar';
import Footer from './Footer';
import { Outlet } from 'react-router-dom';

const Layout = () => {
    return (
        <>
            <Navbar />
            <main className="flex-grow px-4 py-6">
                <Outlet />
            </main>
            <Footer />
        </>
    );
};

export default Layout;
