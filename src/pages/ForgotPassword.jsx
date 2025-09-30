// src/pages/ForgotPassword.jsx
import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import api from "../utils/api";
import toast, { Toaster } from "react-hot-toast";

export default function ForgotPassword() {
    const [submitting, setSubmitting] = useState(false);

    const formik = useFormik({
        initialValues: { email: "" },
        validationSchema: Yup.object({
            email: Yup.string().email("Invalid email").required("Email is required"),
        }),
        onSubmit: async (values) => {
            if (submitting) return;
            try {
                setSubmitting(true);
                // BASE: .../api/auth/ -> faqat nisbiy yo‘l
                const res = await api.post("password-reset/", { email: values.email });
                const msg = res?.data?.detail || "If this email exists, reset link was sent.";
                toast.success(msg);
            } catch (error) {
                const d = error?.response?.data || {};
                toast.error(d.detail || "Something went wrong.");
            } finally {
                setSubmitting(false);
            }
        },
    });

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <Toaster />
            <div className="grid grid-cols-1 md:grid-cols-2 w-full max-w-5xl bg-white shadow-xl rounded-2xl overflow-hidden">
                {/* CHAP QISM */}
                <div className="bg-gradient-to-br from-blue-700 to-blue-500 p-10 text-white flex items-center justify-center">
                    <div className="text-center space-y-4 max-w-md">
                        <h1 className="text-4xl font-bold">Forgot Your Password?</h1>
                        <p className="text-lg opacity-90">
                            Don’t worry! Enter your email and we’ll send you a link to reset it.
                        </p>
                        <img
                            src="/job-search.svg"
                            alt="job search"
                            className="w-52 mx-auto mt-4 invert"
                            onError={(e) => (e.target.style.display = "none")}
                        />
                    </div>
                </div>

                {/* O‘NG QISM */}
                <div className="p-6 sm:p-10 flex items-center justify-center">
                    <form onSubmit={formik.handleSubmit} className="space-y-5 w-full max-w-md">
                        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-2">
                            Reset Password
                        </h2>

                        <input
                            name="email"
                            type="email"
                            placeholder="Enter your email"
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className="w-full bg-gray-50 text-gray-900 border border-gray-300 p-3 rounded-lg focus:outline-blue-500"
                            aria-invalid={formik.touched.email && !!formik.errors.email}
                            aria-describedby="email-error"
                        />
                        {formik.touched.email && formik.errors.email && (
                            <p id="email-error" className="text-sm text-red-500">
                                {formik.errors.email}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
                        >
                            Send Reset Link
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
