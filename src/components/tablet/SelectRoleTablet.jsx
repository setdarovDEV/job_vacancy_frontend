import React from "react";
import { useNavigate } from "react-router-dom";

export default function SelectRoleTablet() {
    const navigate = useNavigate();

    return (
        <div className="w-full h-screen bg-white flex items-center justify-center px-4">
            <div className="flex flex-col gap-6 w-full max-w-[360px]">

                {/* Job Seeker Button */}
                <button
                    onClick={() => navigate("/register/job-seeker")}
                    className="w-[330px] h-[127px] ml-[15px] bg-[#F5F8FC] rounded-2xl px-4 py-6 text-center shadow hover:bg-[#e9eff9] transition"
                >
                    <p className="text-black text-[16px] font-semibold">
                        Я работаю, <br /> хочу найти работу
                    </p>
                </button>

                {/* Employer Button */}
                <button
                    onClick={() => navigate("/register/employer")}
                    className="w-[330px] h-[127px] ml-[15px] bg-[#F5F8FC] rounded-2xl px-4 py-6 text-center shadow hover:bg-[#e9eff9] transition"
                >
                    <p className="text-black text-[16px] font-semibold">
                        Я клиент, которому <br /> нужно найти профессионалов.
                    </p>
                </button>

            </div>
        </div>
    );
}
