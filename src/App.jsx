import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Register from "./pages/Register";
import Login from "./pages/Login";
import LoginSuccess from "./pages/LoginSuccess";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import TwoFA from "./pages/TwoFA";
import EmailVerifyPage from "./pages/EmailVerifyPage";
import RoleSelectPage from "./pages/RoleSelectPage";
import LandingPage from "./pages/LandingPage";
import CommunityPage from "./pages/CommunityPage";
import ChatPage from "./pages/ChatPage";
import VacancyPage from "./pages/VacanciesPage";
import CompaniesPage from "./pages/CompaniesPage";
import Home from "./pages/Home";
import HomeEmployer from "./pages/HomeEmployer";
import PasswordReset from "./pages/PasswordReset";
import ResetPasswordPage from "./pages/ConfirmPassword";
import RoleBasedPage from "./pages/RoleBasedPage.jsx";
import EmployerResponsesPage from "./components/EmployerResponsesPage.jsx";
import ProfilePage from "./pages/ProfilePage";
import ApplicantProfileByApplication from "./pages/ApplicantProfileByApplication";
import Activity from "./pages/Activity.jsx";
import PricingPlans from "./pages/PricingPlans.jsx";
import Layout from "./layout/Layout.jsx"; // yo‘ling to‘g‘ri ekaniga ishonch hosil qil

export default function App() {
    return (
        <BrowserRouter>
            <ToastContainer position="top-center" autoClose={2000} />
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/login/success" element={<LoginSuccess />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password/:uid/:token" element={<ResetPassword />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/2fa" element={<TwoFA />} />
                <Route path="/verify" element={<EmailVerifyPage />} />
                <Route path="/role" element={<RoleSelectPage />} />
                <Route path="/community" element={<CommunityPage />} />
                <Route path="/chat" element={<ChatPage />} />
                <Route path="/vacancies" element={<VacancyPage />} />
                <Route path="/companies" element={<CompaniesPage />} />
                <Route path="/profile" element={<RoleBasedPage />} />
                <Route path="/home" element={<Home />} />
                <Route path="/password-reset" element={<PasswordReset />} />
                <Route path="/confirm-password/:uid/:token" element={<ResetPasswordPage />} />
                <Route path="/employer/applications" element={<EmployerResponsesPage />} />
                {/* 👇 bu yerda “/” yetishmayapti edi */}
                <Route path="/employer/applications/:jobId" element={<EmployerResponsesPage />} />
                <Route path="/profiles/:id" element={<ProfilePage />} />
                <Route path="/applicants/by-application/:applicationId" element={<ApplicantProfileByApplication />} />
                <Route path="/activity" element={<Activity />} />
                <Route path="/pricing-plans" element={<PricingPlans />} />
            </Routes>
        </BrowserRouter>
    );
}
