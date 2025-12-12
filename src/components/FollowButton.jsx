// components/FollowButton.jsx
import React, { useState } from "react";
import api from "../utils/api";

export default function FollowButton({
                                         companyId,
                                         defaultFollowing = false,
                                         defaultCount = 0,
                                         langCode = "RU",
                                         className = "",
                                         onChange,
                                     }) {
    const [following, setFollowing] = useState(!!defaultFollowing);
    const [count, setCount] = useState(Number(defaultCount) || 0);
    const [loading, setLoading] = useState(false);

    const labelSubscribe = langCode === "RU" ? "Подписаться" : "Obuna bo‘lish";
    const labelUnsubscribe = langCode === "RU" ? "Отписка" : "Bekor qilish";

    const handleClick = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (loading) return;

        setLoading(true);

        try {
            const url = `/api/companies/${companyId}/toggle-follow/`;
            const { data } = await api.post(url);

            const serverFollowing = data?.is_following ?? false;
            const serverCount = data?.followers_count ?? count;

            setFollowing(serverFollowing);
            setCount(serverCount);

            onChange?.({
                following: serverFollowing,
                followers_count: serverCount,
            });
        } catch (err) {
            console.error("Follow error:", err);
            alert("Подписка не удалась");
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            disabled={loading}
            onClick={handleClick}
            className={`rounded-md w-[108px] h-[29px] text-[10px] transition border-none
                ${following ? "bg-[#3066BE26] text-black" : "bg-[#3066BE] text-white"}
                ${loading ? "opacity-60 cursor-not-allowed" : ""} ${className}`}
        >
            {following ? labelUnsubscribe : labelSubscribe}
        </button>
    );
}
