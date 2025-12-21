import React, { useState } from 'react';
import { X } from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../utils/api';

export default function ChangeContactModal({ currentEmail, onClose, onSuccess }) {
    const [step, setStep] = useState(1); // 1: Send Code, 2: Verify Code
    const [newEmail, setNewEmail] = useState('');
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Step 1: Send verification code to new email
    const handleSendCode = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            console.log('📧 Sending code to new email:', newEmail);

            const response = await api.post('/api/auth/update-email-send/', {
                new_email: newEmail.trim()
            });

            console.log('✅ Code sent response:', response.data);

            if (response.status === 200) {
                toast.success('Код отправлен на новый email ✅');
                setStep(2);
            }
        } catch (err) {
            console.error('❌ Send code error:', err);

            const errorMsg =
                err.response?.data?.error ||
                err.response?.data?.detail ||
                'Ошибка при отправке кода';

            setError(errorMsg);
            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    // Step 2: Verify code and update email
    const handleVerifyCode = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            console.log('🔍 Verifying code:', code);

            const response = await api.post('/api/auth/update-email-verify/', {
                code: code.trim()
            });

            console.log('✅ Email updated:', response.data);

            if (response.status === 200) {
                toast.success('E-mail успешно изменен! ✅');
                onSuccess();
            }
        } catch (err) {
            console.error('❌ Verify code error:', err);

            const errorMsg =
                err.response?.data?.error ||
                err.response?.data?.detail ||
                'Неверный код или код истёк';

            setError(errorMsg);
            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 relative">
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                    disabled={loading}
                >
                    <X className="w-6 h-6" />
                </button>

                <h2 className="text-2xl font-bold text-black mb-6">
                    Изменить контактную информацию
                </h2>

                {/* Step 1: Send Code */}
                {step === 1 && (
                    <form onSubmit={handleSendCode}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Текущий E-mail
                            </label>
                            <input
                                type="email"
                                value={currentEmail}
                                disabled
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-500"
                            />
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Новый E-mail
                            </label>
                            <input
                                type="email"
                                value={newEmail}
                                onChange={(e) => setNewEmail(e.target.value)}
                                placeholder="Введите новый email"
                                required
                                disabled={loading}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3066BE]"
                            />
                        </div>

                        {error && (
                            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                                {error}
                            </div>
                        )}

                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={onClose}
                                disabled={loading}
                                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 disabled:opacity-50"
                            >
                                Назад
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 px-4 py-3 bg-[#3066BE] text-white rounded-lg font-medium hover:bg-[#2556a8] disabled:opacity-50"
                            >
                                {loading ? 'Отправка...' : 'Отправить код'}
                            </button>
                        </div>
                    </form>
                )}

                {/* Step 2: Verify Code */}
                {step === 2 && (
                    <form onSubmit={handleVerifyCode}>
                        <div className="mb-4">
                            <p className="text-sm text-gray-600 mb-4">
                                Введите код отправлен вам в почту
                            </p>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Введите код отправлен вам в почту
                            </label>
                            <input
                                type="text"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                placeholder="Введите 6-значный код"
                                maxLength={6}
                                required
                                disabled={loading}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3066BE] text-center text-2xl font-mono tracking-widest"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Новый E-mail
                            </label>
                            <input
                                type="email"
                                value={newEmail}
                                disabled
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-500"
                            />
                        </div>

                        {error && (
                            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                                {error}
                            </div>
                        )}

                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={() => {
                                    setStep(1);
                                    setCode('');
                                    setError('');
                                }}
                                disabled={loading}
                                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 disabled:opacity-50"
                            >
                                Назад
                            </button>
                            <button
                                type="submit"
                                disabled={loading || code.length !== 6}
                                className="flex-1 px-4 py-3 bg-[#3066BE] text-white rounded-lg font-medium hover:bg-[#2556a8] disabled:opacity-50"
                            >
                                {loading ? 'Проверка...' : 'Изменить E-mail'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}