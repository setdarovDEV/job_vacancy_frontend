export type Company = {
    id: number;
    name: string;
    logo?: string | null;     // /media/... bo'lishi mumkin
    about?: string | null;
};

export type Vacancy = {
    id: number;
    title: string;
    company: Company | number; // ba'zan id, ba'zan nested
    salary_min?: number | null;
    salary_max?: number | null;
    city?: string | null;
    created_at?: string;
};

export type Page<T> = {
    count: number;
    next: string | null;
    previous: string | null;
    results: T[];
};
