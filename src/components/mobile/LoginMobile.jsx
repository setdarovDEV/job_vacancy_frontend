import React from "react";

export default function LoginMobile({
                                        username,
                                        password,
                                        onChangeUsername,
                                        onChangePassword,
                                        onSubmit,
                                        error,
                                        successMessage,
                                        isLoading
                                    }) {
    return (
        <div className="min-h-screen bg-white text-black flex items-center justify-center px-4">
            <div className="w-full max-w-[360px] bg-[#F4F6FA] rounded-2xl p-6 shadow">
                <h1 className="text-[22px] leading-[30px] font-bold text-center mt-1 mb-6">
                    Вход в аккаунт
                </h1>

                {successMessage && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                        <p className="text-green-600 text-sm font-semibold text-center">
                            ✅ {successMessage}
                        </p>
                    </div>
                )}

                <form className="space-y-5" onSubmit={onSubmit}>
                    {/* Username */}
                    <div className="flex justify-center">
                        <input
                            type="text"
                            placeholder="Ваше имя пользователя"
                            className="w-full max-w-[300px] bg-[#F4F6FA] placeholder-[#585858] border-0 border-b border-black/90 focus:outline-none focus:border-[#3066BE] py-2 text-[14px] transition disabled:opacity-50"
                            value={username}
                            onChange={onChangeUsername} // ✅ Event obyektini to'g'ridan uzatamiz
                            disabled={isLoading}
                            autoComplete="username"
                            required
                        />
                    </div>

                    {/* Password */}
                    <div className="flex justify-center">
                        <input
                            type="password"
                            placeholder="Пароль"
                            className="w-full max-w-[300px] bg-[#F4F6FA] placeholder-[#585858] border-0 border-b border-black/90 focus:outline-none focus:border-[#3066BE] py-2 text-[14px] transition disabled:opacity-50"
                            value={password}
                            onChange={onChangePassword} // ✅ Event obyektini to'g'ridan uzatamiz
                            disabled={isLoading}
                            autoComplete="current-password"
                            required
                        />
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-2 mx-auto max-w-[300px]">
                            <p className="text-red-600 text-xs text-center">{error}</p>
                        </div>
                    )}

                    {/* Forgot */}
                    <div className="text-left max-w-[300px] mx-auto">

                        <a href="/password-reset"
                        className="text-[12px] font-semibold leading-[18px] hover:underline hover:text-[#3066BE] text-black ml-[6px]"
                        >
                        Забыли пароль?
                    </a>
            </div>

            {/* Submit */}
            <div className="flex justify-center pt-1">
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-[180px] h-[50px] bg-[#3066BE] text-white text-[15px] font-semibold rounded-xl active:scale-[0.99] transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? (
                        <div className="flex items-center justify-center gap-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            <span>Вход...</span>
                        </div>
                    ) : (
                        "Вход в аккаунт"
                    )}
                </button>
            </div>

            {/* Register */}
            <div className="text-center">

                <a href="/register"
                className="text-[12px] text-[#3066BE] hover:underline"
                >
                Еще нет учетной записи?
            </a>
        </div>
</form>
</div>
</div>
);
}