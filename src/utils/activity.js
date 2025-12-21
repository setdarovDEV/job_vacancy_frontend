// src/utils/activity.js
import api from "./api";

/**
 * ✅ Fetch user's job applications (Apply qilingan vakansiyalar)
 * Backend: GET /api/applications/my/
 */
export async function fetchApplications() {
    try {
        console.log("📤 Fetching applications...");
        const response = await api.get("/api/applications/my/");
        console.log("✅ Applications RAW response:", response.data);

        // Backend paginated object qaytaradi: {count, results}
        const rawItems = response.data?.results || [];
        console.log("✅ Raw items count:", rawItems.length);
        console.log("✅ First raw item:", rawItems[0]);

        // Format each application - FILTER'siz!
        const formattedItems = rawItems.map((item, index) => {
            console.log(`🔄 Formatting item ${index + 1}:`, item);
            const formatted = formatApplication(item);
            console.log(`✅ Formatted item ${index + 1}:`, formatted);
            return formatted;
        });

        console.log("✅ Final formatted items count:", formattedItems.length);

        return {
            results: formattedItems,
            count: formattedItems.length,
        };
    } catch (error) {
        console.error("❌ fetchApplications error:", error);
        console.error("Error details:", error.response?.data);
        throw error;
    }
}

/**
 * ✅ Fetch saved vacancies
 * Backend: GET /api/applications/saved-jobs/
 */
export async function fetchSavedVacancies() {
    try {
        console.log("📤 Fetching saved vacancies...");
        const response = await api.get("/api/applications/saved-jobs/");
        console.log("✅ Saved vacancies RAW response:", response.data);

        const rawItems = response.data?.results || [];
        console.log("✅ Raw saved items count:", rawItems.length);
        console.log("✅ First raw saved item:", rawItems[0]);

        // Format without filter
        const formattedItems = rawItems.map((item, index) => {
            console.log(`🔄 Formatting saved item ${index + 1}:`, item);
            const formatted = formatSavedVacancy(item);
            console.log(`✅ Formatted saved item ${index + 1}:`, formatted);
            return formatted;
        });

        console.log("✅ Final saved items count:", formattedItems.length);

        return {
            results: formattedItems,
            count: response.data?.count || formattedItems.length,
        };
    } catch (error) {
        console.error("❌ fetchSavedVacancies error:", error);
        console.error("Error details:", error.response?.data);

        if (error.response?.status === 404) {
            console.warn("⚠️ Saved vacancies endpoint not found. Returning empty array.");
            return { results: [], count: 0 };
        }

        throw error;
    }
}

/**
 * ✅ Format application data for frontend
 */
export function formatApplication(app) {
    if (!app) {
        console.warn("⚠️ formatApplication: app is null/undefined");
        return null;
    }

    console.log("🔄 Formatting application:", app);

    // Backend structure: { id, job_post, job: {id, title, location, company}, status, created_at }
    const jobData = app.job || {};
    const jobPostId = app.job_post || jobData.id;

    // Budget formatlash
    let salary = null;
    if (jobData.budget_min && jobData.budget_max) {
        salary = `${jobData.budget_min}–${jobData.budget_max} USD`;
    } else if (jobData.budget_min) {
        salary = `от ${jobData.budget_min} USD`;
    } else if (jobData.budget_max) {
        salary = `до ${jobData.budget_max} USD`;
    }

    const formatted = {
        id: app.id,
        job_post: jobPostId,
        vacancy: {
            id: jobData.id || jobPostId,
            title: jobData.title || "Vacancy",
            company_name: jobData.company?.name || "—",
            location: jobData.location || "—",
            slug: jobData.id || jobPostId,
            salary: salary,
        },
        status: app.status || "APPLIED",
        cover_letter: app.cover_letter || "",
        created_at: app.created_at,
        created: app.created_at,
        date: app.created_at,
    };

    console.log("✅ Formatted application:", formatted);
    return formatted;
}

/**
 * ✅ Format saved vacancy for frontend
 */
export function formatSavedVacancy(vacancy) {
    if (!vacancy) {
        console.warn("⚠️ formatSavedVacancy: vacancy is null/undefined");
        return null;
    }

    console.log("🔄 Formatting saved vacancy:", vacancy);

    const formatted = {
        id: vacancy.id,
        title: vacancy.title || "Vacancy",
        company_name: vacancy.company?.name || "—",
        location: vacancy.location || "—",
        city: vacancy.location || "—",
        salary: formatBudget(vacancy),
        slug: vacancy.id,
        company: vacancy.company || null,
    };

    console.log("✅ Formatted saved vacancy:", formatted);
    return formatted;
}

/**
 * Helper: Format budget from backend
 */
function formatBudget(vacancy) {
    const min = vacancy.budget_min;
    const max = vacancy.budget_max;

    if (min && max) {
        return `${min}–${max} USD`;
    }
    if (min) {
        return `от ${min} USD`;
    }
    if (max) {
        return `до ${max} USD`;
    }

    // Try to parse budget string if it exists
    if (vacancy.budget && typeof vacancy.budget === 'string') {
        return vacancy.budget;
    }

    return null;
}

/**
 * ✅ Apply to a job
 */
export async function applyToJob(jobId, coverLetter = "") {
    try {
        console.log("📤 Applying to job:", jobId);
        const response = await api.post("/api/applications/apply/", {
            job_post: jobId,
            cover_letter: coverLetter,
        });
        console.log("✅ Apply response:", response.data);
        return response.data;
    } catch (error) {
        console.error("❌ applyToJob error:", error);
        console.error("Error details:", error.response?.data);

        if (error.response?.status === 400) {
            const detail = error.response?.data?.detail;
            if (detail) throw new Error(detail);
        }

        throw error;
    }
}

/**
 * ✅ Cancel job application
 */
export async function cancelApplication(jobId) {
    try {
        console.log("📤 Canceling application for job:", jobId);
        await api.delete(`/api/applications/jobs/${jobId}/mine/`);
        console.log("✅ Application canceled");
        return true;
    } catch (error) {
        console.error("❌ cancelApplication error:", error);
        throw error;
    }
}

/**
 * ✅ Save a vacancy
 */
export async function saveVacancy(vacancyId) {
    try {
        console.log("📤 Saving vacancy:", vacancyId);
        const response = await api.post(`/api/vacancies/jobposts/${vacancyId}/save/`);
        console.log("✅ Vacancy saved:", response.data);
        return response.data;
    } catch (error) {
        console.error("❌ saveVacancy error:", error);
        throw error;
    }
}

/**
 * ✅ Remove saved vacancy
 */
export async function removeSavedVacancy(vacancyId) {
    try {
        console.log("📤 Removing saved vacancy:", vacancyId);
        await api.delete(`/api/vacancies/jobposts/${vacancyId}/save/`);
        console.log("✅ Vacancy unsaved");
        return true;
    } catch (error) {
        console.error("❌ removeSavedVacancy error:", error);
        throw error;
    }
}

/**
 * ✅ Check if vacancy is saved
 */
export async function checkIfSaved(vacancyId) {
    try {
        console.log("📤 Checking if saved:", vacancyId);
        const response = await api.get(`/api/vacancies/jobposts/${vacancyId}/`);
        console.log("✅ Is saved check:", response.data);
        return response.data?.is_saved || false;
    } catch (error) {
        console.error("❌ checkIfSaved error:", error);
        return false;
    }
}

/**
 * ✅ Get application status for a specific job
 */
export async function getApplicationStatus(jobId) {
    try {
        console.log("📤 Getting application status for job:", jobId);
        const response = await api.get("/api/applications/my/");
        const applications = Array.isArray(response.data) ? response.data : [];

        const app = applications.find((a) => {
            const appJobId = a.job_post || a.job?.id;
            return String(appJobId) === String(jobId);
        });

        console.log("✅ Application status:", app || "Not found");
        return app || null;
    } catch (error) {
        console.error("❌ getApplicationStatus error:", error);
        return null;
    }
}