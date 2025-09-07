// src/components/mobile/SelectRoleMobile.jsx
import React from "react";

export default function SelectRoleMobile({ onSelect }) {
    return (
        <div className="min-h-screen bg-white text-black flex items-center justify-center px-4">
            <div className="w-full max-w-[360px]">
                <div className="space-y-4">
                    {/* JOB SEEKER */}
                    <button
                        onClick={() => onSelect("JOB_SEEKER")}
                        className="w-full bg-[#F4F6FA] rounded-2xl p-5 text-left shadow active:scale-[0.99] transition"
                    >
                        <div className="flex items-center gap-3">
                            <div>
                                <p className="text-[15px] text-center ml-[90px] leading-[22px] font-semibold">
                                    Я работаю, <br/>
                                    хочу найти работу
                                </p>
                            </div>
                        </div>
                    </button>

                    {/* EMPLOYER */}
                    <button
                        onClick={() => onSelect("EMPLOYER")}
                        className="w-full bg-[#F4F6FA] rounded-2xl p-5 text-left shadow active:scale-[0.99] transition"
                    >
                        <div className="flex items-center gap-3">
                            <div>
                                <p className="text-[15px] text-center ml-[43px] leading-[22px] font-semibold">
                                    Я клиент, которому <br/>
                                    нужно найти профессионалов.
                                </p>
                            </div>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
}
