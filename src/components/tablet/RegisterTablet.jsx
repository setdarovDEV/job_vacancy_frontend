import React from "react";
import { Link } from "react-router-dom";

export default function RegisterTablet() {
    return (
        <div className="w-full h-screen bg-white text-black flex items-center justify-center px-4 md:px-6">
            <div className="w-[330px] max-w-[360px] bg-[#F5F8FC] rounded-2xl px-6 py-8 shadow-md">
                <h2 className="text-center text-[20px] font-semibold mb-6">
                    Зарегистрироваться
                </h2>
                <form onSubmit={(e) => e.preventDefault()}>
                    {/* First Name */}
                    <div className="mb-4">
                        <input
                            type="text"
                            placeholder="Ваше имя"
                            className="w-full border-0 border-b border-black bg-transparent focus:outline-none"
                            required
                        />
                    </div>

                    {/* Last Name */}
                    <div className="mb-4">
                        <input
                            type="text"
                            placeholder="Фамилия"
                            className="w-full border-0 border-b border-black bg-transparent focus:outline-none"
                            required
                        />
                    </div>

                    {/* Username */}
                    <div className="mb-4">
                        <input
                            type="text"
                            placeholder="Ваше имя пользователя"
                            className="w-full border-0 border-b border-black bg-transparent focus:outline-none"
                            required
                        />
                    </div>

                    {/* Password */}
                    <div className="mb-4">
                        <input
                            type="password"
                            placeholder="Пароль"
                            className="w-full border-0 border-b border-black bg-transparent focus:outline-none"
                            required
                        />
                    </div>

                    {/* Confirm Password */}
                    <div className="mb-4">
                        <input
                            type="password"
                            placeholder="Подтвердите пароль"
                            className="w-full border-0 border-b border-black bg-transparent focus:outline-none"
                            required
                        />
                    </div>

                    {/* Terms */}
                    <div className="mb-6 flex items-start gap-2">
                        <input type="checkbox" className="mt-1" required />
                        <label className="text-xs leading-tight text-gray-700">
                            Я прочитал и принял Политику конфиденциальности и Условия
                        </label>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-[160px] ml-[57px] bg-[#3066BE] text-white font-semibold py-2 rounded-[13px] hover:opacity-90 transition"
                    >
                        Следующий →
                    </button>

                    {/* Already have account */}
                    <div className="text-center text-[12px] text-[#3066BE] mt-4">
                        <Link to="/login" className="hover:underline">
                            Уже есть аккаунт?
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
