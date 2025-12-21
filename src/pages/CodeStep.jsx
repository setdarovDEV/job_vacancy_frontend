import React, { useState, useRef, useEffect } from 'react';
import api from '../utils/api';

const CodeStep = ({ email, onNext, onBack }) => {
    const [code, setCode] = useState(['', '', '', '', '', '']);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const inputRefs = useRef([]);

    useEffect(() => {
        inputRefs.current[0]?.focus();
    }, []);

    const handleChange = (index, value) => {
        if (!/^\d*$/.test(value)) return;

        const newCode = [...code];
        newCode[index] = value;
        setCode(newCode);

        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !code[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').slice(0, 6);
        const newCode = pastedData.split('').concat(Array(6).fill('')).slice(0, 6);
        setCode(newCode);
        inputRefs.current[5]?.focus();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const fullCode = code.join('').trim();

        if (fullCode.length !== 6) {
            setError('Введите полный код');
            return;
        }

        setError('');
        console.log('✅ Code verified, moving to password step');
        console.log('🔢 Code:', fullCode);

        // ✅ Keyingi bosqichga o'tish
        onNext(fullCode);
    };

    const handleResend = async () => {
        setLoading(true);
        setError('');

        try {
            console.log('🔄 Resending code to:', email);

            // ✅ Mobile API endpoint
            const response = await api.post('/api/auth/mobile/password-reset/', {
                email: email.trim()
            });

            if (response.status === 200) {
                alert('Код повторно отправлен на ваш email ✅');
                setCode(['', '', '', '', '', '']);
                inputRefs.current[0]?.focus();
            }
        } catch (err) {
            console.error('❌ Resend error:', err);
            const errorMsg = err.response?.data?.error ||
                err.response?.data?.detail ||
                'Ошибка при повторной отправке';
            setError(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="step-container">
            <h2>Введите код</h2>
            <p className="subtitle">
                Мы отправили 6-значный код на <strong>{email}</strong>
            </p>

            <form onSubmit={handleSubmit}>
                <div className="code-inputs" onPaste={handlePaste}>
                    {code.map((digit, index) => (
                        <input
                            key={index}
                            ref={(el) => (inputRefs.current[index] = el)}
                            type="text"
                            inputMode="numeric"
                            maxLength="1"
                            value={digit}
                            onChange={(e) => handleChange(index, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(index, e)}
                            disabled={loading}
                            className="code-input"
                        />
                    ))}
                </div>

                {error && <div className="error-message">{error}</div>}

                <button
                    type="submit"
                    className="btn-primary"
                    disabled={loading || code.join('').length !== 6}
                >
                    {loading ? 'Проверка...' : 'Продолжить'}
                </button>

                <div className="resend-section">
                    <span>Не получили код? </span>
                    <button
                        type="button"
                        onClick={handleResend}
                        className="link-button"
                        disabled={loading}
                    >
                        Отправить снова
                    </button>
                </div>

                <button
                    type="button"
                    onClick={onBack}
                    className="back-link"
                    disabled={loading}
                >
                    ← Назад
                </button>
            </form>
        </div>
    );
};

export default CodeStep;