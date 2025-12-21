// src/components/ApplyButton.jsx
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { applyToJob, getApplicationStatus, cancelApplication } from "../utils/activity";

export default function ApplyButton({ jobId, jobTitle }) {
    const [loading, setLoading] = useState(false);
    const [application, setApplication] = useState(null);
    const [checkingStatus, setCheckingStatus] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [coverLetter, setCoverLetter] = useState("");

    // Check if already applied on mount
    useEffect(() => {
        checkStatus();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [jobId]);

    async function checkStatus() {
        try {
            setCheckingStatus(true);
            const app = await getApplicationStatus(jobId);
            setApplication(app);
        } catch (error) {
            console.error("Status check error:", error);
        } finally {
            setCheckingStatus(false);
        }
    }

    async function handleApply() {
        if (!coverLetter.trim()) {
            toast.warning("Iltimos, qisqa xat yozing");
            return;
        }

        setLoading(true);
        try {
            const result = await applyToJob(jobId, coverLetter);
            setApplication(result);
            setShowModal(false);
            setCoverLetter("");
            toast.success("Ariza muvaffaqiyatli yuborildi! ✅");
        } catch (error) {
            const message = error.message || "Arizani yuborishda xatolik";
            toast.error(message);
        } finally {
            setLoading(false);
        }
    }

    async function handleCancel() {
        if (!window.confirm("Arizani bekor qilmoqchimisiz?")) return;

        setLoading(true);
        try {
            await cancelApplication(jobId);
            setApplication(null);
            toast.info("Ariza bekor qilindi");
        } catch (error) {
            toast.error("Bekor qilishda xatolik");
        } finally {
            setLoading(false);
        }
    }

    // Loading state
    if (checkingStatus) {
        return (
            <button
                disabled
                className="w-full md:w-auto px-8 py-3 rounded-xl bg-gray-300 text-gray-600 cursor-not-allowed"
            >
                Yuklanmoqda...
            </button>
        );
    }

    // Already applied
    if (application) {
        return (
            <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                    <span className="px-4 py-2 rounded-lg bg-green-100 text-green-700 font-medium">
                        ✓ Ariza yuborilgan
                    </span>
                    <span className="text-sm text-gray-600">
                        Status: <span className="font-medium">{getStatusText(application.status)}</span>
                    </span>
                </div>
                <button
                    onClick={handleCancel}
                    disabled={loading}
                    className="text-sm text-red-600 hover:text-red-700 underline disabled:opacity-50"
                >
                    {loading ? "Bekor qilinmoqda..." : "Arizani bekor qilish"}
                </button>
            </div>
        );
    }

    // Apply button
    return (
        <>
            <button
                onClick={() => setShowModal(true)}
                disabled={loading}
                className="w-full md:w-auto px-8 py-3 rounded-xl bg-[#3066BE] text-white font-semibold hover:bg-[#274f94] transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
                Ariza yuborish
            </button>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-lg w-full p-6">
                        <h3 className="text-2xl font-bold mb-4">Ariza yuborish</h3>
                        <p className="text-gray-600 mb-4">Vakansiya: <span className="font-medium text-black">{jobTitle}</span></p>

                        <div className="mb-6">
                            <label className="block text-sm font-medium mb-2">
                                Qisqa xat (Cover Letter)
                            </label>
                            <textarea
                                value={coverLetter}
                                onChange={(e) => setCoverLetter(e.target.value)}
                                placeholder="Nega siz bu ishga mos ekanligingizni yozing..."
                                rows={6}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3066BE]"
                            />
                            <p className="text-sm text-gray-500 mt-2">
                                {coverLetter.length} / 500 belgi
                            </p>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowModal(false)}
                                className="flex-1 px-4 py-3 rounded-xl border border-gray-300 hover:bg-gray-50 transition"
                            >
                                Bekor qilish
                            </button>
                            <button
                                onClick={handleApply}
                                disabled={loading || !coverLetter.trim()}
                                className="flex-1 px-4 py-3 rounded-xl bg-[#3066BE] text-white font-semibold hover:bg-[#274f94] transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? "Yuborilmoqda..." : "Yuborish"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

function getStatusText(status) {
    const statusMap = {
        APPLIED: "Yuborilgan",
        SHORTLISTED: "Ko'rib chiqilmoqda",
        REJECTED: "Rad etilgan",
        HIRED: "Qabul qilingan",
    };
    return statusMap[status] || status;
}