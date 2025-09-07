import React, { useEffect, useRef, useState } from "react";
import {
    ArrowLeft, CalendarClock,
    Image as ImageIcon, Camera, Plus, Send, Mic
} from "lucide-react";

export default function ChatConversationMobile({
                                                   open,
                                                   onClose,
                                                   peer = {
                                                       id: 1,
                                                       name: "Abbos Setdarov",
                                                       avatar: "/profile.png",
                                                       online: true,
                                                   },
                                               }) {
    const [input, setInput] = useState("");
    const [selectedLang, setSelectedLang] = useState({ flag: "/ru.png", code: "RU" });
    const langCode = selectedLang?.code === "GB" ? "EN" : (selectedLang?.code || "RU");
    const [showTools, setShowTools] = useState(false);
    const [messages, setMessages] = useState(() => ([
        { id: 1, from: "them", text: "Salom! Qanday ketyapti?", ts: "10:24" },
        { id: 2, from: "me",   text: "Zo‘r, rahmat. Loyihani topshirdik ✅", ts: "10:26" },
        { id: 3, from: "them", text: "Ajoyib! Ertaga qo‘ng‘iroq qilsak bo‘ladimi?", ts: "10:27" },
    ]));

    const taRef = useRef(null);
    const scRef = useRef(null);

    useEffect(() => {
        if (open) {
            // auto focus, auto scroll
            setTimeout(() => {
                taRef.current?.focus();
                scrollToBottom();
            }, 0);
        }
    }, [open]);

    useEffect(() => {
        autoGrow();
    }, [input]);

    const autoGrow = () => {
        const el = taRef.current;
        if (!el) return;
        el.style.height = "40px";
        el.style.height = Math.min(el.scrollHeight, 120) + "px";
    };

    const scrollToBottom = () => {
        const sc = scRef.current;
        if (!sc) return;
        sc.scrollTop = sc.scrollHeight + 9999;
    };

    const handleSend = () => {
        const txt = input.trim();
        if (!txt) return;
        const newMsg = {
            id: Date.now(),
            from: "me",
            text: txt,
            ts: new Date().toLocaleTimeString().slice(0,5),
        };
        setMessages((m) => [...m, newMsg]);
        setInput("");
        setShowTools(false);
        requestAnimationFrame(scrollToBottom);
    };

    const handlePickImage = (file) => {
        if (!file) return;
        const newMsg = {
            id: Date.now(),
            from: "me",
            image: URL.createObjectURL(file),
            ts: new Date().toLocaleTimeString().slice(0,5),
        };
        setMessages((m) => [...m, newMsg]);
        requestAnimationFrame(scrollToBottom);
    };

    if (!open) return null;


    const texts = {
        RU: {
            community: "Сообщество",
            vacancies: "Вакансии",
            chat: "Чат",
            companies: "Компании",
            login: "Войти",
            loginWarn: "Пожалуйста, войдите в систему.",
            anonymous: "Разместить пост анонимно",
            asSchoolStudent: "как студент школы",
            asCollegeStudent: "как студент колледжа",
            asUniversityStudent: "как студент университета",
            createPost: "Создать публикацию",
            createPublication: "Создать публикацию",
            placeholder: "Поделитесь опытом или получите совет...",
            publish: "Опубликовать",
            publishing: "Публикую...",
            addImage: "Добавить изображение",
            needTextOrImage: "Нужен текст или изображение.",
            postError: "Ошибка при создании поста.",
            like: "Лайк",
            comment: "Комментарий",
            send: "Отправить",
            search: "Поиск...",
            you: "Вы",
            loadMore: "Показать ещё",
            loading: "Загрузка...",
            topAccounts: "Топ аккаунты",
            seeAll: "Посмотреть все →",
            communityDesc: "Сообщество профессионалов...",
            view: "Смотреть",
            logo: "Logo",
            links: ["Помощь","Наши вакансии","Реклама на сайте","Требования к ПО","Инвесторам","Каталог компаний","Работа по профессиям"],
            copyShort: "© 2025 «HeadHunter – Вакансии».",
            sitemap: "Карта сайта",
            rights: "Все права защищены.",
            createSite: "Создание сайтов",
        },
        UZ: {
            community: "Jamiyat",
            vacancies: "Vakansiyalar",
            chat: "Chat",
            companies: "Kompaniyalar",
            login: "Kirish",
            loginWarn: "Tizimga kiring.",
            anonymous: "Postni anonim joylashtirish",
            asSchoolStudent: "maktab o‘quvchisi sifatida",
            asCollegeStudent: "kollej talabasi sifatida",
            asUniversityStudent: "universitet talabasi sifatida",
            createPost: "Post yaratish",
            createPublication: "Post yaratish",
            placeholder: "Tajriba ulashing yoki maslahat oling...",
            publish: "Yaratish",
            publishing: "Yuklanmoqda...",
            addImage: "Rasm qo‘shish",
            needTextOrImage: "Matn yoki rasm bo‘lishi kerak.",
            postError: "Post yaratishda xatolik.",
            like: "Layk",
            comment: "Izoh",
            send: "Yuborish",
            search: "Qidiruv...",
            you: "Siz",
            loadMore: "Yana ko‘rsatish",
            loading: "Yuklanmoqda...",
            topAccounts: "Top akkauntlar",
            seeAll: "Hammasini ko‘rish →",
            communityDesc: "Konsalting professionallari jamiyati...",
            view: "Ko‘rish",
            logo: "Logo",
            links: ["Yordam","Bizning vakantiyalar","Saytda reklama","Dasturiy ta'minot talablari","Investorlar uchun","Kompaniyalar katalogi","Kasblar bo‘yicha ishlar"],
            copyShort: "© 2025 «HeadHunter – Vakansiyalar».",
            sitemap: "Sayt xaritasi",
            rights: "Barcha huquqlar himoyalangan.",
            createSite: "Sayt yaratish",
        },
        EN: {
            community: "Community",
            vacancies: "Vacancies",
            chat: "Chat",
            companies: "Companies",
            login: "Login",
            loginWarn: "Please log in.",
            anonymous: "Post anonymously",
            asSchoolStudent: "as a school student",
            asCollegeStudent: "as a college student",
            asUniversityStudent: "as a university student",
            createPost: "Create post",
            createPublication: "Create publication",
            placeholder: "Share your experience or ask for advice...",
            publish: "Publish",
            publishing: "Publishing...",
            addImage: "Add image",
            needTextOrImage: "Text or image is required.",
            postError: "Failed to create post.",
            like: "Like",
            comment: "Comment",
            send: "Send",
            search: "Search...",
            you: "You",
            loadMore: "Load more",
            loading: "Loading...",
            topAccounts: "Top accounts",
            seeAll: "See all →",
            communityDesc: "Community of professionals...",
            view: "View",
            logo: "Logo",
            links: ["Help","Our Vacancies","Advertising on site","Software Requirements","For Investors","Company Catalog","Jobs by Profession"],
            copyShort: "© 2025 “HeadHunter – Vacancies”.",
            sitemap: "Sitemap",
            rights: "All rights reserved.",
            createSite: "Website creation",
        },
    };

    return (
        <div className="fixed inset-0 z-[100] bg-white flex flex-col">
            <div className="h-[60px] md:h-[80px] lg:h-[90px]" aria-hidden />

            {/* HEADER */}
            <div className="px-3 pt-3">
                <div className="w-full bg-[#F4F6FA] rounded-2xl px-3 py-2 flex items-center justify-between">
                    {/* back */}
                    <button
                        onClick={onClose}
                        aria-label="Back"
                        className="p-2 -ml-1 active:scale-95 bg-[#F4F6FA] border-none"
                    >
                        <ArrowLeft className="w-5 h-5 text-[#2B50A4]" />
                    </button>

                    {/* avatar + name + last seen */}
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="relative shrink-0">
                            <img
                                src={peer?.avatar || "/user.jpg"}
                                alt={peer?.name || "user"}
                                className="w-10 h-10 rounded-full object-cover border"
                            />
                            {peer?.online && (
                                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-green-500 ring-2 ring-[#F4F6FA]" />
                            )}
                        </div>

                        <div className="min-w-0">
                            <div className="text-[16px] font-semibold text-black truncate">
                                {peer?.name || "User"}
                            </div>
                            <div className="text-[12px] text-[#8A8A8A] truncate">
                                {peer?.online
                                    ? "онлайн"
                                    : peer?.lastSeenText || "был(а) 2 часа назад"}
                            </div>
                        </div>
                    </div>

                    {/* right icon (calendar/meet) */}
                    <button
                        type="button"
                        aria-label="Schedule"
                        className="p-2 -mr-1 active:scale-95"
                    >
                        <CalendarClock className="w-5 h-5 text-black" />
                    </button>
                </div>
            </div>


            {/* MESSAGES */}
            <div ref={scRef} className="flex-1 overflow-y-auto px-3 pt-3 pb-2">
                {/* Sana bo‘luvchi (misol) */}
                <div className="flex items-center justify-center my-2">
          <span className="text-[11px] px-3 py-1 rounded-full bg-gray-100 text-gray-500">
            Bugun
          </span>
                </div>

                {messages.map((m) => (
                    <div key={m.id} className={`mb-2 flex ${m.from === "me" ? "justify-end" : "justify-start"}`}>
                        <div
                            className={`max-w-[75%] rounded-2xl px-3 py-2 shadow-sm ${
                                m.from === "me" ? "bg-[#3066BE] text-white rounded-br-sm" : "bg-[#EEEEEE] text-black rounded-bl-sm"
                            }`}
                        >
                            {m.image ? (
                                <img src={m.image} alt="attachment" className="rounded-lg max-h-64 object-cover" />
                            ) : (
                                <p className="text-[14px] whitespace-pre-wrap">{m.text}</p>
                            )}
                            <div className={`text-[11px] mt-1 ${m.from === "me" ? "text-white/70" : "text-gray-500"}`}>
                                {m.ts}
                            </div>
                        </div>
                    </div>
                ))}
                {/* Typing indicator (demo) */}
                {/* <div className="mt-3 flex items-center gap-2">
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:120ms]" />
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:240ms]" />
        </div> */}
            </div>

            {/* ATTACHMENT TOOLS (floating above input) */}
            {showTools && (
                <div className="px-3 pb-2">
                    <div className="flex gap-3">
                        <label className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-100 active:scale-[0.98] cursor-pointer">
                            <ImageIcon className="w-5 h-5 text-[#3066BE]" />
                            <span className="text-sm text-[#3066BE]">Rasm</span>
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => handlePickImage(e.target.files?.[0])}
                            />
                        </label>
                    </div>
                </div>
            )}

            {/* INPUT BAR */}
            <div className="sticky bottom-0 z-40 bg-white border-t border-black/10 px-3 pt-2 pb-[calc(10px+env(safe-area-inset-bottom))]">
                <div className="flex items-center gap-2">
                    <div
                        className={`shrink-0 relative z-10 w-10 h-10 flex items-center justify-center rounded-full bg-[#F4F6FA] active:scale-95 ${showTools ? "ring-2 ring-[#2B50A4]/30" : ""}`}
                        onClick={() => setShowTools(v => !v)}
                        aria-label="Open tools"
                    >
                        <Plus className="w-5 h-5 text-[#3066BE]" />
                    </div>

                    <div className="flex-1 min-h-[44px] max-h-[160px] px-3 rounded-2xl bg-[#F4F6FA] flex items-center">
      <textarea
          ref={taRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Сообщение…"
          rows={1}
          className="w-full bg-transparent text-black border-none resize-none outline-none text-[14px] leading-5 py-1"
          onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
              }
          }}
      />
                    </div>

                    {input.trim() ? (
                        <div
                            onClick={handleSend}
                            className="shrink-0 relative z-10 w-10 h-10 rounded-full bg-[#2B50A4] text-white flex items-center justify-center active:scale-95"
                            aria-label="Send"
                        >
                            <Send className="w-5 h-5 " />
                        </div>
                    ) : (
                        <div
                            className="shrink-0 relative z-10 w-10 h-10 rounded-full bg-[#F4F6FA] flex items-center justify-center active:scale-95"
                            aria-label="Voice"
                        >
                            <Mic className="w-5 h-5 text-[#3066BE]" />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
