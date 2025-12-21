import React, { useState } from 'react';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';

const PasswordStep = ({ email, code, onBack }) => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validatsiya
        if (password.length < 6) {
            setError('Пароль должен содержать минимум 6 символов');
            return;
        }

        if (password !== confirmPassword) {
            setError('Пароли не совпадают');
            return;
        }

        setLoading(true);

        try {
            const requestData = {
                email: email.trim(),
                code: code.trim(),
                new_password: password
            };

            console.log('🔐 Resetting password...');
            console.log('📧 Email:', requestData.email);
            console.log('🔢 Code:', requestData.code);
            console.log('🔒 Password length:', requestData.new_password.length);

            // ✅ Mobile API endpoint
            const response = await api.post(
                '/api/auth/mobile/password-reset-confirm/',
                requestData
            );

            console.log('✅ Password reset response:', response.data);

            if (response.status === 200) {
                alert('Пароль успешно изменен! ✅');
                navigate('/login');
            }
        } catch (err) {
            console.error('❌ Password reset error:', err);

            if (err.response) {
                const errorMsg =
                    err.response.data?.error ||
                    err.response.data?.detail ||
                    err.response.data?.message ||
                    'Ошибка при изменении пароля';

                console.error('❌ Backend error:', {
                    status: err.response.status,
                    data: err.response.data,
                    url: err.response.config?.url
                });

                setError(errorMsg);
            } else if (err.request) {
                console.error('❌ No response from server:', err.request);
                setError('Server bilan bog\'lanishda xatolik');
            } else {
                console.error('❌ Request error:', err.message);
                setError('Noma\'lum xatolik yuz berdi');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="step-container">
            <h2>Создайте новый пароль</h2>
            <p className="subtitle">
                Введите новый пароль для вашего аккаунта
            </p>

            <form onSubmit={handleSubmit}>
                <div className="input-group">
                    <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Новый пароль (минимум 6 символов)"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={loading}
                        autoComplete="new-password"
                        minLength={6}
                    />
                    <button
                        type="button"
                        className="toggle-password"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={loading}
                    >
                        {showPassword ? '👁️' : '👁️‍🗨️'}
                    </button>
                </div>

                <div className="input-group">
                    <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Подтвердите пароль"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        disabled={loading}
                        autoComplete="new-password"
                        minLength={6}
                    />
                </div>

                {error && <div className="error-message">{error}</div>}

                <button
                    type="submit"
                    className="btn-primary"
                    disabled={loading}
                >
                    {loading ? 'Сохранение...' : 'Сохранить пароль'}
                </button>

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

export default PasswordStep;