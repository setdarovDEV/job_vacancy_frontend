// src/components/SaveButton.jsx
import React, { useState, useEffect } from "react";
import { Bookmark } from "lucide-react";
import { toast } from "react-toastify";
import { saveVacancy, removeSavedVacancy, checkIfSaved } from "../utils/activity";

export default function SaveButton({ vacancyId, className = "" }) {
    const [isSaved, setIsSaved] = useState(false);
    const [loading, setLoading] = useState(false);
    const [checking, setChecking] = useState(true);

    // Check if saved on mount
    useEffect(() => {
        checkStatus();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [vacancyId]);

    async function checkStatus() {
        try {
            setChecking(true);
            const saved = await checkIfSaved(vacancyId);
            setIsSaved(saved);
        } catch (error) {
            console.error("Check saved status error:", error);
        } finally {
            setChecking(false);
        }
    }

    async function handleToggle() {
        setLoading(true);
        try {
            if (isSaved) {
                await removeSavedVacancy(vacancyId);
                setIsSaved(false);
                toast.info("Saqlangan vakansiyalardan o'chirildi");
            } else {
                await saveVacancy(vacancyId);
                setIsSaved(true);
                toast.success("Vakansiya saqlandi ✅");
            }
        } catch (error) {
            toast.error("Xatolik yuz berdi");
        } finally {
            setLoading(false);
        }
    }

    if (checking) {
        return (
            <button
                disabled
                className={`flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed ${className}`}
            >
                <Bookmark size={20} />
                <span className="hidden md:inline">Yuklanmoqda...</span>
            </button>
        );
    }

    return (
        <button
            onClick={handleToggle}
            disabled={loading}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition ${
                isSaved
                    ? "border-[#3066BE] bg-[#3066BE] text-white hover:bg-[#274f94]"
                    : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
            } disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
            title={isSaved ? "Saqlangan vakansiyalardan o'chirish" : "Vakansiyani saqlash"}
        >
            <Bookmark size={20} fill={isSaved ? "currentColor" : "none"} />
            <span className="hidden md:inline">
                {loading ? "..." : isSaved ? "Saqlangan" : "Saqlash"}
            </span>
        </button>
    );
}