import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "../layout/Layout";
import Register from "../pages/Register";
import Login from "../pages/Login";
import Home from "../pages/Home";

const AppRoutes = () => (
    <Router>
        <Routes>
            {/* Layout ichidagi sahifalar */}
            <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
            </Route>

            {/* Layoutsiz sahifalar (scroll bo‘lmasligi uchun) */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
        </Routes>
    </Router>
);

export default AppRoutes;
