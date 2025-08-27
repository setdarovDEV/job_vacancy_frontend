import React from "react";

export default function EmailVerifyTablet() {
    return (
        <div className="w-full h-screen bg-white flex items-center justify-center px-4 text-black">
            <div className="w-full max-w-[360px] bg-[#F5F8FC] rounded-2xl px-6 py-8 shadow-md">
                <h2 className="text-center text-[20px] font-semibold mb-6">Ваш E-mail</h2>

                <form onSubmit={(e) => e.preventDefault()}>
                    {/* Email input */}
                    <div className="mb-6">
                        <input
                            type="email"
                            placeholder="Напишите E-mail адрес"
                            className="w-full border-0 border-b border-black bg-transparent focus:outline-none focus:border-black"
                            required
                        />
                    </div>

                    {/* Submit button */}
                    <button
                        type="submit"
                        className="bg-[#3066BE] w-[158px] ml-[74px] text-white font-semibold py-2 rounded-xl hover:opacity-90 transition"
                    >
                        Следующий →
                    </button>
                </form>
            </div>
        </div>
    );
}
