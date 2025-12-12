import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// ✅ Import qo'shildi
import PrivateRoute from "./components/PrivateRoute";
import PublicRoute from "./components/PublicRoute";

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
import HomeEmployer from "./pages/HomeEmployer";
import PasswordReset from "./pages/PasswordReset";
import ResetPasswordPage from "./pages/ConfirmPassword";
import RoleBasedPage from "./pages/RoleBasedPage.jsx";
import EmployerResponsesPage from "./components/EmployerResponsesPage.jsx";
import ProfilePage from "./pages/ProfilePage";
import ApplicantProfileByApplication from "./pages/ApplicantProfileByApplication";
import Activity from "./pages/Activity.jsx";
import PricingPlans from "./pages/PricingPlans.jsx";
import AuthGateway from "./pages/AuthGateway.jsx";
import AnyUserProfile from './pages/AnyUserProfile';
import EmployerProfilePage from "./pages/EmployerProfilePage.jsx";

// ✅ Responsive komponentlar import
import HomeEmployerTablet from "./components/tablet/HomeEmployer.jsx";
import HomeEmployerMobile from "./components/mobile/HomeEmployerMobile";

// ✅ Responsive Wrapper Component
function ResponsiveHomeEmployer() {
    return (
        <>
            {/* Desktop */}
            <div className="hidden lg:block">
                <HomeEmployer />
            </div>

            {/* Tablet */}
            <div className="hidden md:block lg:hidden">
                <HomeEmployerTablet />
            </div>

            {/* Mobile */}
            <div className="block md:hidden">
                <HomeEmployerMobile />
            </div>
        </>
    );
}

export default function App() {
    return (
        <BrowserRouter>
            <ToastContainer position="top-center" autoClose={2000} />
            <Routes>
                {/* 🌍 Public Routes - Landing */}
                <Route path="/" element={<AuthGateway />} />
                <Route path="/landing" element={<LandingPage />} />

                {/* 🔓 Public Routes - Auth (Login qilmaganlar uchun) */}
                <Route
                    path="/register"
                    element={
                        <PublicRoute>
                            <Register />
                        </PublicRoute>
                    }
                />
                <Route path="/register/step2" element={<TwoFA />} />
                <Route path="/register/step3" element={<EmailVerifyPage />} />
                <Route path="/register/step4" element={<RoleSelectPage />} />

                <Route
                    path="/login"
                    element={
                        <PublicRoute>
                            <Login />
                        </PublicRoute>
                    }
                />

                {/* Password Reset - Public */}
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/password-reset" element={<PasswordReset />} />
                <Route path="/reset-password/:uid/:token" element={<ResetPassword />} />
                <Route path="/confirm-password/:uid/:token" element={<ResetPasswordPage />} />

                {/* 🔐 Private Routes - Dashboard (Login qilganlar uchun) */}
                <Route
                    path="/dashboard"
                    element={
                        <PrivateRoute>
                            <Dashboard />
                        </PrivateRoute>
                    }
                />

                {/* ✅ Responsive Home Employer Route */}
                <Route
                    path="/home-employer"
                    element={
                        <PrivateRoute>
                            <ResponsiveHomeEmployer />
                        </PrivateRoute>
                    }
                />

                <Route
                    path="/community"
                    element={
                        <PrivateRoute>
                            <CommunityPage />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/chat"
                    element={
                        <PrivateRoute>
                            <ChatPage />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/vacancies"
                    element={
                        <PrivateRoute>
                            <VacancyPage />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/companies"
                    element={
                        <PrivateRoute>
                            <CompaniesPage />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/profile"
                    element={
                        <PrivateRoute>
                            <RoleBasedPage />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/profiles/:id"
                    element={
                        <PrivateRoute>
                            <ProfilePage />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/employer/applications"
                    element={
                        <PrivateRoute>
                            <EmployerResponsesPage />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/employer/applications/:jobId"
                    element={
                        <PrivateRoute>
                            <EmployerResponsesPage />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/applicants/by-application/:applicationId"
                    element={
                        <PrivateRoute>
                            <ApplicantProfileByApplication />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/activity"
                    element={
                        <PrivateRoute>
                            <Activity />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/pricing-plans"
                    element={
                        <PrivateRoute>
                            <PricingPlans />
                        </PrivateRoute>
                    }
                />

                {/* Other routes */}
                <Route path="/login/success" element={<LoginSuccess />} />
                <Route path="/profile/:userId" element={<AnyUserProfile />} />
                <Route path="/employer/:id" element={<EmployerProfilePage />} />
            </Routes>
        </BrowserRouter>
    );
}