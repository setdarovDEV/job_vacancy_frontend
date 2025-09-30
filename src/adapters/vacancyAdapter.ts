import { Vacancy } from "../../types/";
import { asMediaUrl } from ".././utils/media";

export type UIVacancy = {
    id: number;
    title: string;
    companyName: string;
    companyLogo: string; // to'liq URL
    salary: string;      // "5–8 mln" ko'rinishida
    city: string;
    createdAt: string;
};

export function toUIVacancy(v: Vacancy): UIVacancy {
    const c = (typeof v.company === "object" ? v.company : { name: "", logo: "" }) as any;
    const salary =
        v.salary_min && v.salary_max
            ? `${v.salary_min}–${v.salary_max}`
            : v.salary_min
                ? `${v.salary_min}+`
                : v.salary_max
                    ? `≤ ${v.salary_max}`
                    : "—";
    return {
        id: v.id,
        title: v.title,
        companyName: c?.name || "",
        companyLogo: asMediaUrl(c?.logo || ""),
        salary,
        city: v.city || "",
        createdAt: v.created_at || "",
    };
}
