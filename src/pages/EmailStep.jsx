import React, { useState } from 'react';
import api from '../utils/api';

const EmailStep = ({ onNext }) => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            console.log('📧 Sending password reset request to:', email);

            // ✅ Mobile API endpoint
            const response = await api.post('/api/auth/mobile/password-reset/', {
                email: email.trim()
            });

            console.log('✅ Response:', response.data);

            if (response.status === 200) {
                console.log('✅ Code sent successfully!');
                onNext(email);
            }
        } catch (err) {
            console.error('❌ Password reset error:', err);

            if (err.response) {
                const errorMsg =
                    err.response.data?.error ||
                    err.response.data?.detail ||
                    err.response.data?.message ||
                    'Email yuborishda xatolik yuz berdi';

                console.error('❌ Backend error:', {
                    status: err.response.status,
                    data: err.response.data
                });

                setError(errorMsg);
            } else if (err.request) {
                console.error('❌ No response from server');
                setError('Server bilan bog\'lanishda xatolik. Internetni tekshiring.');
            } else {
                console.error('❌ Request setup error:', err.message);
                setError('Noma\'lum xatolik yuz berdi');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="step-container">
            <h2>Забыли пароль?</h2>
            <p className="subtitle">
                Введите свой email, и мы отправим вам код для восстановления пароля
            </p>

            <form onSubmit={handleSubmit}>
                <div className="input-group">
                    <input
                        type="email"
                        placeholder="Ваш email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={loading}
                        autoComplete="email"
                    />
                </div>

                {error && <div className="error-message">{error}</div>}

                <button
                    type="submit"
                    className="btn-primary"
                    disabled={loading}
                >
                    {loading ? 'Отправка...' : 'Отправить код'}
                </button>

                <a href="/login" className="back-link">
                    Вернуться к входу
                </a>
            </form>
        </div>
    );
};

export default EmailStep;