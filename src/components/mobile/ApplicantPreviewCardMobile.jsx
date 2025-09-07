// src/components/mobile/ApplicantPreviewCardMobile.jsx
import React, {useState} from "react";
import { Star } from "lucide-react";

export default function ApplicantPreviewCardMobile({
                                                       avatar = "/user.png",
                                                       fullName = "Lola Yuldasheva",
                                                       title = "Графический дизайнер, веб дизайнер",
                                                       rating = 4.5,
                                                       summary = "",
                                                       skills = ["Лого дизайн", "Adobe Illustrator", "Adobe Photoshop"],
                                                   }) {
    const AVATAR_FALLBACK = "/user.png";
    const truncate = (s, n = 220) => (s && s.length > n ? s.slice(0, n - 1) + "…" : s || "");
    const [profileImage, setProfileImage] = useState(localStorage.getItem("profile_image") || null);

    return (
        <div className="bg-white px-4 py-3">
            <div className="border-b border-[#AEAEAE] p-3">
                {/* Top: avatar + name + rating */}
                <div className="flex items-center gap-3">
                    <img
                        src={profileImage || "/user.jpg"}
                        alt="avatar"
                        className="w-14 h-14 rounded-full object-cover"
                    />
                    <div className="min-w-0">
                        <div className="flex items-center gap-2">
                            <div className="font-bold text-[18px] leading-none truncate text-black">{fullName}</div>
                            <div className="flex items-center gap-1 text-[14px] text-black">
                                <Star className="w-4 h-4 text-yellow-400" fill="currentColor" />
                                <span className="font-medium">{Number(rating || 0).toFixed(1)}</span>
                            </div>
                        </div>
                        <div className="text-[14px] text-black/40 mt-1">{title}</div>
                    </div>
                </div>

                {/* Summary */}
                {summary ? (
                    <p className="mt-4 text-[14px] text-black/50">
                        {truncate(summary)}
                    </p>
                ) : null}

                {/* Skills */}
                {Array.isArray(skills) && skills.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-3">
                        {skills.slice(0, 6).map((s, i) => (
                            <span
                                key={`${s}-${i}`}
                                className="px-2 py-1 rounded-full bg-[#D9D9D9] text-black text-[10px]"
                            >
                                {s}
                              </span>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
