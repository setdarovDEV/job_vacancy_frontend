// src/api/experience.js
import api from "../utils/api";

const toIsoDate = (year, month) => {
    if (!year || !month) return null;
    return `${year}-${String(month).padStart(2, "0")}-01`; // YYYY-MM-01
};

export const fetchExperiences = async () => {
    const { data } = await api.get("experience/experiences/");
    return Array.isArray(data) ? data : (data.results || []);
};

export const createExperience = async ({
                                           company, title, startYear, startMonth,
                                           endYear, endMonth, worksHere,
                                           description, city, country,
                                       }) => {
    const payload = {
        company_name: company?.trim(),
        position: title?.trim(),
        start_date: toIsoDate(startYear, startMonth),
        end_date: worksHere ? null : toIsoDate(endYear, endMonth),
        description: description || "",
        city: city || "",
        country: country || "",
    };

    // bo‘sh stringlarni olib tashlaymiz
    Object.keys(payload).forEach(k => payload[k] === "" || payload[k] === undefined
        ? delete payload[k] : null);

    return api.post("experience/experiences/", payload, {
        headers: { "Content-Type": "application/json" },
    });
};

export const updateExperience = (id, partial) =>
    api.patch(`experience/experiences/${id}/`, partial, {
        headers: { "Content-Type": "application/json" },
    });

export const deleteExperience = (id) =>
    api.delete(`experience/experiences/${id}/`);
