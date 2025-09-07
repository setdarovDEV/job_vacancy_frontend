// src/components/HeaderNotifications.jsx
import React from "react";
import { HelpCircle, Bell } from "lucide-react";

export default function HeaderNotifications({
                                                count = 1,
                                                onBellClick = () => {},
                                                className = "",
                                            }) {
    return (
        <div className={`flex items-center gap-4 ${className}`}>
            {/* Bell with badge */}
            <button
                onClick={onBellClick}
                aria-label="Notifications"
                className="relative p-1 rounded-md bg-white border-none ml-[350px] mt-[20px] hover:bg-black/5 active:scale-95"
            >
                <Bell className="w-5 h-5 md:w-6 md:h-6 text-black" />
                {count > 0 && (
                    <span
                        className="absolute -top-1 -right-1 min-w-[16px] h-[16px] px-1
                       bg-red-600 text-white text-[10px] leading-[16px]
                       rounded-full text-center font-semibold"
                    >
            {count}
          </span>
                )}
            </button>
        </div>
    );
}
