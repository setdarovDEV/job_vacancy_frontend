import React, { useState, useEffect } from "react";
import api from "../../utils/api.js";

export default function TopAccountsCarousel({ lang, texts, companies = [] }) {
  const [items, setItems] = useState(companies);
  
  const toggleFollow = async (companyId) => {
  const prev = items.find((x) => x.id === companyId);
  if (!prev) return;

  const prevFollow = !!prev.is_following;
  const prevCount = prev.followers_count ?? 0;

  // 🔹 Optimistik UI yangilash
  setItems((cur) =>
    cur.map((c) =>
      c.id === companyId
        ? {
            ...c,
            is_following: !prevFollow,
            followers_count: Math.max(0, prevCount + (prevFollow ? -1 : 1)),
          }
        : c
    )
  );

  try {
    // 🔹 TO‘G‘RILANGAN ENDPOINT (toggle-follow)
    const { data } = await api.post(`/api/companies/${companyId}/toggle-follow/`);
    setItems((cur) =>
      cur.map((c) =>
        c.id === companyId
          ? {
              ...c,
              is_following: data.is_following,
              followers_count: data.followers_count,
            }
          : c
      )
    );
  } catch (err) {
    console.error("Follow toggle error:", err);
    // revert holat
    setItems((cur) =>
      cur.map((c) =>
        c.id === companyId
          ? { ...c, is_following: prevFollow, followers_count: prevCount }
          : c
      )
    );
    if (err?.response?.status === 401) alert("Obuna bo‘lish uchun tizimga kiring!");
  }
  };


  useEffect(() => {
    setItems(companies || []);
  }, [companies]);

  return (
    <div className="w-full p-5 bg-white border border-gray-200 shadow-sm rounded-2xl">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-4">
        <span className="font-semibold text-[18px] text-black">
          {texts?.[lang]?.topAccounts || "Top akkauntlar"}
        </span>
        <a
          href="/companies"
          className="text-[#3066BE] text-sm font-medium hover:underline"
        >
          {texts?.[lang]?.seeAll || "Hammasini ko‘rish →"}
        </a>
      </div>

      {/* NO DATA */}
      {items.length === 0 && (
        <div className="text-[#AEAEAE] text-sm py-2">Данных нет</div>
      )}

      {/* CAROUSEL */}
      <div className="flex gap-5 pb-2 overflow-x-auto">
        {items.map((c) => (
          <div
            key={c.id}
            className="flex-shrink-0 w-[200px] min-h-[230px] bg-white rounded-xl border border-gray-200 
                       p-4 flex flex-col justify-between items-center text-center 
                       shadow-sm hover:shadow-md transition duration-300"
          >
            {/* UPPER PART */}
            <div className="flex flex-col items-center flex-grow gap-3">
              <div className="w-[65px] h-[65px] rounded-full overflow-hidden border border-gray-200 bg-[#F5F7FA]">
                <img
                  src={c.logo_url || c.logo || "/company.png"}
                  alt={c.name}
                  className="object-cover w-full h-full"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = "/company.png";
                  }}
                />
              </div>

              <div className="font-semibold text-[15px] text-black truncate w-full">
                {c.name}
              </div>

              <div className="text-[#AEAEAE] text-[12px] leading-[16px] px-2">
                {texts?.[lang]?.communityDesc || "Professional jamiyat..."}
              </div>
            </div>

            {/* BUTTON */}
            <div className="w-full mt-3">
              <button
                className={`w-full text-[13px] font-medium py-2 rounded-md transition
                  ${
                    c.is_following
                      ? "bg-[#3066BE] text-white hover:bg-[#274f94]"
                      : "bg-[#3066BE]/10 text-[#3066BE] hover:bg-[#3066BE]/20"
                  }`}
                onClick={() => toggleFollow(c.id)}
              >
                {c.is_following
                  ? texts?.[lang]?.unsubscribe || "Отписаться"
                  : texts?.[lang]?.subscribe || "Подписаться"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
