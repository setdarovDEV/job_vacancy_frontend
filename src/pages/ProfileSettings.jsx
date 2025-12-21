import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronRight, X } from "lucide-react";
import { toast } from "react-toastify";
import api from "../utils/api";
import ProfileDropdown from "../components/ProfileDropdown.jsx";
import ChangeContactModal from "../components/ChangeContactModal.jsx";
import ChangePasswordModal from "../components/ChangePasswordModal.jsx";
import ChangeNameModal from "../components/ChangeNameModal.jsx";
import ChangeUsernameModal from "../components/ChangeUsernameModal.jsx";
import MobileFooter from "../components/mobile/MobileFooter.jsx";

// ============================================================
// MAIN PROFILE SETTINGS COMPONENT
// ============================================================
export default function ProfileSettings() {
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [isTablet, setIsTablet] = useState(window.innerWidth >= 768 && window.innerWidth < 1024);

    // Responsive handler
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
            setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024);
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Render based on screen size
    if (isMobile) {
        return <ProfileSettingsMobile />;
    }

    if (isTablet) {
        return <ProfileSettingsTablet />;
    }

    return <ProfileSettingsDesktop />;
}

// ============================================================
// TEXTS
// ============================================================
const TEXTS = {
    RU: {
        community: "Сообщество",
        vacancies: "Вакансии",
        chat: "Чат",
        companies: "Компании",
        logo: "Logo",
        settingsTitle: "Настройки профиля",
        password: "Пароль",
        username: "Имя пользователя",
        name: "Имя",
        contactInfo: "Контактная информация",
        links: [
            "Помощь",
            "Наши вакансии",
            "Реклама на сайте",
            "Требования к ПО",
            "Инвесторам",
            "Каталог компаний",
            "Работа по профессиям"
        ],
        copyright: "© 2025 «HeadHunter – Вакансии». Все права защищены. Карта сайта",
    },
};

// ============================================================
// DESKTOP VERSION (>= 1024px)
// ============================================================
function ProfileSettingsDesktop() {
    const t = TEXTS.RU;
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showContactModal, setShowContactModal] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [showNameModal, setShowNameModal] = useState(false);
    const [showUsernameModal, setShowUsernameModal] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await api.get("/api/auth/profile/");
                setUser(res.data);
            } catch (err) {
                console.error("❌ Profile load error:", err);
                toast.error("Профиль загрузить не удалось");
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, []);

    const handleSettingClick = (setting) => {
        if (setting === "password") {
            setShowPasswordModal(true);
        } else if (setting === "contact") {
            setShowContactModal(true);
        } else if (setting === "username") {
            setShowUsernameModal(true);
        } else if (setting === "name") {
            setShowNameModal(true);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#F4F6FA] flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#3066BE] mx-auto"></div>
                    <p className="mt-4 text-gray-600">Загрузка...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F4F6FA]">
            {/* Navbar */}
            <nav className="fixed top-0 left-0 w-full z-50 bg-white shadow-sm">
                <div className="w-full max-w-[1800px] mx-auto flex items-center justify-between px-10 h-[90px]">
                    <Link to="/">
                        <img src="/logo.png" alt="Logo" className="w-[109px] h-[72px] object-contain" />
                    </Link>

                    <div className="flex gap-8 font-semibold text-[16px]">
                        <Link to="/community" className="text-gray-700 hover:text-[#3066BE] transition-colors">
                            {t.community}
                        </Link>
                        <Link to="/vacancies" className="text-gray-700 hover:text-[#3066BE] transition-colors">
                            {t.vacancies}
                        </Link>
                        <Link to="/chat" className="text-gray-700 hover:text-[#3066BE] transition-colors">
                            {t.chat}
                        </Link>
                        <Link to="/companies" className="text-gray-700 hover:text-[#3066BE] transition-colors">
                            {t.companies}
                        </Link>
                    </div>

                    <div className="flex items-center gap-4">
                        <ProfileDropdown />
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="pt-[130px] pb-20 px-8 max-w-[1400px] mx-auto">
                {/* Settings Card */}
                <div className="bg-white rounded-[24px] border border-gray-200 shadow-sm p-8">
                    <h1 className="text-[32px] font-bold text-black mb-8 text-center">
                        {t.settingsTitle}
                    </h1>

                    {/* Settings List */}
                    <div className="space-y-0">
                        {/* Password */}
                        <div
                            onClick={() => handleSettingClick("password")}
                            className="flex items-center justify-between py-6 border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors"
                        >
                            <div>
                                <p className="text-[18px] font-semibold text-black mb-1">{t.password}</p>
                                <p className="text-[16px] text-gray-500">**********</p>
                            </div>
                            <ChevronRight className="w-6 h-6 text-gray-400" />
                        </div>

                        {/* Username */}
                        <div
                            onClick={() => handleSettingClick("username")}
                            className="flex items-center justify-between py-6 border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors"
                        >
                            <div>
                                <p className="text-[18px] font-semibold text-black mb-1">{t.username}</p>
                                <p className="text-[16px] text-gray-500">{user?.username || user?.full_name || "—"}</p>
                            </div>
                            <ChevronRight className="w-6 h-6 text-gray-400" />
                        </div>

                        {/* Name */}
                        <div
                            onClick={() => handleSettingClick("name")}
                            className="flex items-center justify-between py-6 border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors"
                        >
                            <div>
                                <p className="text-[18px] font-semibold text-black mb-1">{t.name}</p>
                                <p className="text-[16px] text-gray-500">{user?.full_name || user?.first_name + " " + user?.last_name || "—"}</p>
                            </div>
                            <ChevronRight className="w-6 h-6 text-gray-400" />
                        </div>

                        {/* Contact Information */}
                        <div
                            onClick={() => handleSettingClick("contact")}
                            className="flex items-center justify-between py-6 cursor-pointer hover:bg-gray-50 transition-colors"
                        >
                            <div>
                                <p className="text-[18px] font-semibold text-black mb-1">{t.contactInfo}</p>
                                <p className="text-[16px] text-gray-500">{user?.email || "—"}</p>
                            </div>
                            <ChevronRight className="w-6 h-6 text-gray-400" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Modals */}
            {showContactModal && (
                <ChangeContactModal
                    currentEmail={user?.email}
                    onClose={() => setShowContactModal(false)}
                    onSuccess={() => {
                        setShowContactModal(false);
                        // Refresh user data
                        api.get("/api/auth/profile/").then(res => setUser(res.data)).catch(console.error);
                    }}
                />
            )}

            {showPasswordModal && (
                <ChangePasswordModal
                    onClose={() => setShowPasswordModal(false)}
                    onSuccess={() => {
                        setShowPasswordModal(false);
                        toast.success("Пароль успешно изменен");
                    }}
                />
            )}

            {showNameModal && (
                <ChangeNameModal
                    currentFirstName={user?.first_name}
                    currentLastName={user?.last_name}
                    onClose={() => setShowNameModal(false)}
                    onSuccess={() => {
                        setShowNameModal(false);
                        // Refresh user data
                        api.get("/api/auth/profile/").then(res => setUser(res.data)).catch(console.error);
                    }}
                />
            )}

            {showUsernameModal && (
                <ChangeUsernameModal
                    currentUsername={user?.username}
                    onClose={() => setShowUsernameModal(false)}
                    onSuccess={() => {
                        setShowUsernameModal(false);
                        // Refresh user data
                        api.get("/api/auth/profile/").then(res => setUser(res.data)).catch(console.error);
                    }}
                />
            )}

            {/* Footer */}
            <Footer />
        </div>
    );
}

// ============================================================
// TABLET VERSION (768px - 1023px)
// ============================================================
function ProfileSettingsTablet() {
    const t = TEXTS.RU;
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showContactModal, setShowContactModal] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [showNameModal, setShowNameModal] = useState(false);
    const [showUsernameModal, setShowUsernameModal] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await api.get("/api/auth/profile/");
                setUser(res.data);
            } catch (err) {
                console.error("❌ Profile load error:", err);
                toast.error("Профиль загрузить не удалось");
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, []);

    const handleSettingClick = (setting) => {
        if (setting === "password") {
            setShowPasswordModal(true);
        } else if (setting === "contact") {
            setShowContactModal(true);
        } else if (setting === "username") {
            setShowUsernameModal(true);
        } else if (setting === "name") {
            setShowNameModal(true);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#F4F6FA] flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#3066BE] mx-auto"></div>
                    <p className="mt-4 text-gray-600">Загрузка...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F4F6FA]">
            {/* Navbar */}
            <nav className="fixed top-0 left-0 w-full z-50 bg-white shadow-sm">
                <div className="flex items-center justify-between px-6 h-[70px]">
                    <button onClick={() => setMenuOpen(!menuOpen)} className="text-2xl">
                        ☰
                    </button>

                    <Link to="/">
                        <img src="/logo.png" alt="Logo" className="w-[90px] h-[60px] object-contain" />
                    </Link>

                    <div className="flex items-center gap-4">
                        <ProfileDropdown />
                    </div>
                </div>
            </nav>

            {/* Mobile Menu */}
            {menuOpen && (
                <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setMenuOpen(false)}>
                    <div className="absolute left-0 top-0 bottom-0 w-[280px] bg-white p-6" onClick={e => e.stopPropagation()}>
                        <h2 className="text-2xl font-bold mb-6">{t.logo}</h2>
                        <nav className="space-y-4">
                            {t.links.map((link, i) => (
                                <Link key={i} to="#" className="block text-gray-700 hover:text-[#3066BE]">
                                    {link}
                                </Link>
                            ))}
                        </nav>
                    </div>
                </div>
            )}

            {/* Main Content */}
            <div className="pt-[100px] pb-16 px-6">
                {/* Settings Card */}
                <div className="bg-white rounded-[20px] border border-gray-200 shadow-sm p-6">
                    <h1 className="text-[28px] font-bold text-black mb-6 text-center">
                        {t.settingsTitle}
                    </h1>

                    {/* Settings List */}
                    <div className="space-y-0">
                        {/* Password */}
                        <div
                            onClick={() => handleSettingClick("password")}
                            className="flex items-center justify-between py-5 border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors"
                        >
                            <div>
                                <p className="text-[16px] font-semibold text-black mb-1">{t.password}</p>
                                <p className="text-[14px] text-gray-500">**********</p>
                            </div>
                            <ChevronRight className="w-5 h-5 text-gray-400" />
                        </div>

                        {/* Username */}
                        <div
                            onClick={() => handleSettingClick("username")}
                            className="flex items-center justify-between py-5 border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors"
                        >
                            <div>
                                <p className="text-[16px] font-semibold text-black mb-1">{t.username}</p>
                                <p className="text-[14px] text-gray-500">{user?.username || user?.full_name || "—"}</p>
                            </div>
                            <ChevronRight className="w-5 h-5 text-gray-400" />
                        </div>

                        {/* Name */}
                        <div
                            onClick={() => handleSettingClick("name")}
                            className="flex items-center justify-between py-5 border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors"
                        >
                            <div>
                                <p className="text-[16px] font-semibold text-black mb-1">{t.name}</p>
                                <p className="text-[14px] text-gray-500">{user?.full_name || user?.first_name + " " + user?.last_name || "—"}</p>
                            </div>
                            <ChevronRight className="w-5 h-5 text-gray-400" />
                        </div>

                        {/* Contact Information */}
                        <div
                            onClick={() => handleSettingClick("contact")}
                            className="flex items-center justify-between py-5 cursor-pointer hover:bg-gray-50 transition-colors"
                        >
                            <div>
                                <p className="text-[16px] font-semibold text-black mb-1">{t.contactInfo}</p>
                                <p className="text-[14px] text-gray-500">{user?.email || "—"}</p>
                            </div>
                            <ChevronRight className="w-5 h-5 text-gray-400" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Modals */}
            {showContactModal && (
                <ChangeContactModal
                    currentEmail={user?.email}
                    onClose={() => setShowContactModal(false)}
                    onSuccess={() => {
                        setShowContactModal(false);
                        api.get("/api/auth/profile/").then(res => setUser(res.data)).catch(console.error);
                    }}
                />
            )}

            {showPasswordModal && (
                <ChangePasswordModal
                    onClose={() => setShowPasswordModal(false)}
                    onSuccess={() => {
                        setShowPasswordModal(false);
                        toast.success("Пароль успешно изменен");
                    }}
                />
            )}

            {showNameModal && (
                <ChangeNameModal
                    currentFirstName={user?.first_name}
                    currentLastName={user?.last_name}
                    onClose={() => setShowNameModal(false)}
                    onSuccess={() => {
                        setShowNameModal(false);
                        api.get("/api/auth/profile/").then(res => setUser(res.data)).catch(console.error);
                    }}
                />
            )}

            {showUsernameModal && (
                <ChangeUsernameModal
                    currentUsername={user?.username}
                    onClose={() => setShowUsernameModal(false)}
                    onSuccess={() => {
                        setShowUsernameModal(false);
                        api.get("/api/auth/profile/").then(res => setUser(res.data)).catch(console.error);
                    }}
                />
            )}

            {/* Footer */}
            <FooterTablet />
        </div>
    );
}

// ============================================================
// MOBILE VERSION (< 768px)
// ============================================================
function ProfileSettingsMobile() {
    const t = TEXTS.RU;
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showContactModal, setShowContactModal] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await api.get("/api/auth/profile/");
                setUser(res.data);
            } catch (err) {
                console.error("❌ Profile load error:", err);
                toast.error("Профиль загрузить не удалось");
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, []);

    const handleSettingClick = (setting) => {
        if (setting === "password") {
            setShowPasswordModal(true);
        } else if (setting === "contact") {
            setShowContactModal(true);
        } else if (setting === "username") {
            setShowUsernameModal(true);
        } else if (setting === "name") {
            setShowNameModal(true);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#F4F6FA] flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#3066BE] mx-auto"></div>
                    <p className="mt-4 text-gray-600">Загрузка...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F4F6FA]">
            {/* Mobile Navbar */}
            <nav className="fixed top-0 left-0 w-full z-50 bg-white shadow-sm">
                <div className="flex items-center justify-between px-4 h-[60px]">
                    <button onClick={() => setMenuOpen(!menuOpen)} className="text-xl">
                        ☰
                    </button>

                    <Link to="/">
                        <img src="/logo.png" alt="Logo" className="h-[50px] object-contain" />
                    </Link>

                    <ProfileDropdown />
                </div>
            </nav>

            {/* Menu */}
            {menuOpen && (
                <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setMenuOpen(false)}>
                    <div className="absolute left-0 top-0 bottom-0 w-[260px] bg-white p-6" onClick={e => e.stopPropagation()}>
                        <h2 className="text-xl font-bold mb-6">{t.logo}</h2>
                        <nav className="space-y-3">
                            {t.links.map((link, i) => (
                                <Link key={i} to="#" className="block text-gray-700 text-sm">
                                    {link}
                                </Link>
                            ))}
                        </nav>
                    </div>
                </div>
            )}

            {/* Main Content */}
            <div className="pt-[80px] pb-12 px-4">
                {/* Settings Card */}
                <div className="bg-white rounded-[16px] border border-gray-200 shadow-sm p-4">
                    <h1 className="text-[24px] font-bold text-black mb-5 text-center">
                        {t.settingsTitle}
                    </h1>

                    {/* Settings List */}
                    <div className="space-y-0">
                        {/* Password */}
                        <div
                            onClick={() => handleSettingClick("password")}
                            className="flex items-center justify-between py-4 border-b border-gray-200 cursor-pointer active:bg-gray-50 transition-colors"
                        >
                            <div>
                                <p className="text-[15px] font-semibold text-black mb-1">{t.password}</p>
                                <p className="text-[13px] text-gray-500">**********</p>
                            </div>
                            <ChevronRight className="w-5 h-5 text-gray-400" />
                        </div>

                        {/* Username */}
                        <div
                            onClick={() => handleSettingClick("username")}
                            className="flex items-center justify-between py-4 border-b border-gray-200 cursor-pointer active:bg-gray-50 transition-colors"
                        >
                            <div>
                                <p className="text-[15px] font-semibold text-black mb-1">{t.username}</p>
                                <p className="text-[13px] text-gray-500">{user?.username || user?.full_name || "—"}</p>
                            </div>
                            <ChevronRight className="w-5 h-5 text-gray-400" />
                        </div>

                        {/* Name */}
                        <div
                            onClick={() => handleSettingClick("name")}
                            className="flex items-center justify-between py-4 border-b border-gray-200 cursor-pointer active:bg-gray-50 transition-colors"
                        >
                            <div>
                                <p className="text-[15px] font-semibold text-black mb-1">{t.name}</p>
                                <p className="text-[13px] text-gray-500">{user?.full_name || user?.first_name + " " + user?.last_name || "—"}</p>
                            </div>
                            <ChevronRight className="w-5 h-5 text-gray-400" />
                        </div>

                        {/* Contact Information */}
                        <div
                            onClick={() => handleSettingClick("contact")}
                            className="flex items-center justify-between py-4 cursor-pointer active:bg-gray-50 transition-colors"
                        >
                            <div>
                                <p className="text-[15px] font-semibold text-black mb-1">{t.contactInfo}</p>
                                <p className="text-[13px] text-gray-500">{user?.email || "—"}</p>
                            </div>
                            <ChevronRight className="w-5 h-5 text-gray-400" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Modals */}
            {showContactModal && (
                <ChangeContactModal
                    currentEmail={user?.email}
                    onClose={() => setShowContactModal(false)}
                    onSuccess={() => {
                        setShowContactModal(false);
                        api.get("/api/auth/profile/").then(res => setUser(res.data)).catch(console.error);
                    }}
                />
            )}

            {showPasswordModal && (
                <ChangePasswordModal
                    onClose={() => setShowPasswordModal(false)}
                    onSuccess={() => {
                        setShowPasswordModal(false);
                        toast.success("Пароль успешно изменен");
                    }}
                />
            )}

            {showNameModal && (
                <ChangeNameModal
                    currentFirstName={user?.first_name}
                    currentLastName={user?.last_name}
                    onClose={() => setShowNameModal(false)}
                    onSuccess={() => {
                        setShowNameModal(false);
                        api.get("/api/auth/profile/").then(res => setUser(res.data)).catch(console.error);
                    }}
                />
            )}

            {showUsernameModal && (
                <ChangeUsernameModal
                    currentUsername={user?.username}
                    onClose={() => setShowUsernameModal(false)}
                    onSuccess={() => {
                        setShowUsernameModal(false);
                        api.get("/api/auth/profile/").then(res => setUser(res.data)).catch(console.error);
                    }}
                />
            )}

            {/* Footer */}
            <MobileFooter />
        </div>
    );
}

// ============================================================
// FOOTER COMPONENTS
// ============================================================
function Footer() {
    const t = TEXTS.RU;
    return (
        <footer className="w-full h-[393px] relative overflow-hidden">
            <img src="/footer-bg.png" alt="Footer" className="absolute inset-0 w-full h-full object-cover z-0" />
            <div className="absolute inset-0 bg-[#3066BE]/50 z-10"></div>

            <div className="relative z-20">
                <div className="max-w-[1440px] mx-auto px-6 py-10 flex gap-[190px] text-white">
                    <div>
                        <h2 className="text-[48px] font-black text-white">{t.logo}</h2>
                    </div>

                    <div className="grid grid-cols-2 gap-[184px]">
                        <div className="flex flex-col gap-[20px]">
                            {t.links.slice(0, 4).map((link, idx) => (
                                <a key={idx} href="#" className="flex items-center text-white gap-2 hover:text-[#F2F4FD] transition">
                                    <span>&gt;</span> {link}
                                </a>
                            ))}
                        </div>
                        <div className="flex flex-col gap-[20px]">
                            {t.links.slice(4).map((link, idx) => (
                                <a key={idx} href="#" className="flex items-center text-white gap-2 hover:text-[#F2F4FD] transition">
                                    <span>&gt;</span> {link}
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="bg-[#3066BE]/70 h-[103px] rounded-[12px] mx-[38px]">
                    <div className="max-w-[1440px] mx-auto px-6 h-full flex justify-between items-center">
                        <p className="text-white">{t.copyright}</p>
                        <div className="flex gap-[20px] text-[24px] text-white">
                            <a href="#" className="text-white"><i className="fab fa-whatsapp"></i></a>
                            <a href="#" className="text-white"><i className="fab fa-instagram"></i></a>
                            <a href="#" className="text-white"><i className="fab fa-facebook"></i></a>
                            <a href="#" className="text-white"><i className="fab fa-twitter"></i></a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}

function FooterTablet() {
    const t = TEXTS.RU;
    return (
        <footer className="relative overflow-hidden mt-[50px]">
            <img src="/footer-bg.png" alt="Footer" className="absolute inset-0 w-full h-full object-cover z-0" />
            <div className="absolute inset-0 bg-[#3066BE]/55 z-10" />

            <div className="relative z-20 px-6 py-8 text-white">
                <h2 className="text-[36px] font-black mb-6 text-white">{t.logo}</h2>

                <div className="grid grid-cols-2 gap-x-10 gap-y-3 mb-6">
                    {t.links.map((link, i) => (
                        <a key={i} href="#" className="flex text-white items-center gap-2 text-[15px] hover:text-[#E7ECFF]">
                            <span>›</span> {link}
                        </a>
                    ))}
                </div>

                <div className="bg-[#3066BE]/70 rounded-[10px] px-4 py-4">
                    <div className="flex justify-between items-center gap-4">
                        <p className="text-[13px] text-white">{t.copyright}</p>
                        <div className="flex gap-4 text-[20px] text-white">
                            <a href="#" className="text-white"><i className="fab fa-whatsapp" /></a>
                            <a href="#" className="text-white"><i className="fab fa-instagram" /></a>
                            <a href="#" className="text-white"><i className="fab fa-facebook" /></a>
                            <a href="#" className="text-white"><i className="fab fa-twitter" /></a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           