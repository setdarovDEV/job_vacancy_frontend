import React, { useRef, useState } from "react";

export default function EmailCodeVerifyTablet() {
    const inputsRef = useRef([]);
    const [code, setCode] = useState(Array(6).fill(""));

    const handleChange = (e, index) => {
        const val = e.target.value.replace(/\D/, ""); // Faqat raqam
        if (!val) return;

        const newCode = [...code];
        newCode[index] = val;
        setCode(newCode);

        if (index < 5 && val) {
            inputsRef.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace" && !code[index] && index > 0) {
            inputsRef.current[index - 1]?.focus();
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const finalCode = code.join("");
        console.log("Kiritilgan kod:", finalCode);
        // backendga yuborish
    };

    return (
        <div className="w-full h-screen bg-white flex text-black items-center justify-center px-4">
            <div className="w-full max-w-[360px] bg-[#F5F8FC] rounded-2xl px-6 py-8 shadow-md">
                <h2 className="text-center text-[20px] font-semibold mb-6">
                    Проверьте E-mail
                </h2>

                <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4">
                    {/* Code input (6ta) */}
                    <div className="flex gap-2 justify-center">
                        {code.map((val, i) => (
                            <input
                                key={i}
                                type="text"
                                inputMode="numeric"
                                maxLength="1"
                                value={val}
                                onChange={(e) => handleChange(e, i)}
                                onKeyDown={(e) => handleKeyDown(e, i)}
                                ref={(el) => (inputsRef.current[i] = el)}
                                className="w-10 h-12 text-center text-[20px] border border-black rounded-md focus:outline-none"
                            />
                        ))}
                    </div>

                    {/* Timer */}
                    <div className="text-sm text-gray-600 mt-1">02:00</div>

                    {/* Submit */}
                    <button
                        type="submit"
                        className="w-100px bg-[#2F61C9] text-white font-semibold py-2 rounded-xl hover:opacity-90 transition"
                    >
                        Следующий →
                    </button>

                    {/* Resend */}
                    <button
                        type="button"
                        className="text-xs border-none text-[#2F61C9] mt-2 hover:underline"
                    >
                        Не получили код?
                    </button>
                </form>
            </div>
        </div>
    );
}
