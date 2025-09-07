// src/components/mobile/EmailVerifyMobile.jsx
import React from "react";

export default function EmailVerifyMobile({ email, onChangeEmail, onSubmit, error }) {
    return (
        <div className="min-h-screen bg-white text-black flex items-center justify-center px-4">
            <div className="w-full max-w-[360px] bg-[#F6F8FC] rounded-2xl p-6 shadow text-center">
                <h1 className="text-[22px] leading-[30px] font-bold mb-6">Ваш E-mail</h1>

                <form onSubmit={onSubmit} className="space-y-5">
                    <div className="text-left flex justify-center">
                        <input
                            type="email"
                            inputMode="email"
                            placeholder="Напишите E-mail адрес"
                            value={email}
                            onChange={(e) => onChangeEmail(e.target.value)}
                            required
                            className="w-full max-w-[300px] bg-[#F4F6FA] placeholder-[#585858]
                         border-0 border-b border-black/90 focus:outline-none
                         focus:border-black py-2 text-[14px]"
                        />
                    </div>

                    {error && <div className="text-center text-red-500 text-xs">{error}</div>}

                    <div className="flex justify-center pt-1">
                        <button
                            type="submit"
                            className="w-[177px] h-[52px] bg-[#3066BE] text-white text-[15px]
                         font-semibold rounded-xl active:scale-[0.99] transition
                         flex items-center justify-center gap-2"
                        >
                            Следующий
                            <img src="/next.png" alt="next icon" className="w-4 h-4" />
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
