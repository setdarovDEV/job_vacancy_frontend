// components/FollowButton.jsx
import React, { useState } from "react";
import api from "../utils/api"; // sendagi helper

export default function FollowButton({
                                         companyId,
                                         defaultFollowing = false,     // boshlang'ich holat
                                         defaultCount = 0,             // ixtiyoriy: follower soni
                                         texts,                        // ixtiyoriy: { ru: {subscribe, unsubscribe}, ... }
                                         langCode = "ru",
                                         className = "",
                                         onChange,                     // ixtiyoriy: parentga xabar berish
                                     }) {
    const [following, setFollowing] = useState(!!defaultFollowing);
    const [count, setCount] = useState(Number(defaultCount) || 0);
    const [loading, setLoading] = useState(false);

    const labelSubscribe = texts?.[langCode]?.subscribe || "Подписаться";
    const labelUnsubscribe = texts?.[langCode]?.unsubscribe || "Отписаться";

    const handleClick = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (loading) return;

        setLoading(true);
        const willFollow = !following;

        try {
            const url = `/api/companies/${companyId}/${following ? "unfollow" : "follow"}/`;
            const { data } = await api.post(url);

            const serverFollowing = data?.is_following ?? willFollow;
            const serverCount = data?.followers_count ?? (count + (willFollow ? 1 : -1));

            setFollowing(serverFollowing);
            setCount(serverCount);

            onChange?.({ following: serverFollowing, followers_count: serverCount });
        } catch (err) {
            console.error("Follow toggle error:", err);
            // xohlasangiz toast qo‘shing
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
