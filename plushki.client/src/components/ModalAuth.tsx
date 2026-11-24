// components/ModalAuth.tsx
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import '../styles/info-pages.css';
import '../styles/utils/variables.css';
import '../styles/utils/helpers.css';
import './ModalAuth.css';
import { type RegisterFieldErrors } from '../types/auth';

interface ModalAuthProps {
    isOpen: boolean;
    onClose: () => void;
}

interface LoginFieldErrors {
    email?: string;
    password?: string;
    general?: string;
}

const ModalAuth: React.FC<ModalAuthProps> = ({ isOpen, onClose }) => {
    const { login, register, error, clearError } = useAuth();

    const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [registerFieldErrors, setRegisterFieldErrors] = useState<RegisterFieldErrors>({});
    const [loginFieldErrors, setLoginFieldErrors] = useState<LoginFieldErrors>({});
    const [localError, setLocalError] = useState<string | null>(null);

    const modalRef = useRef<HTMLDivElement>(null);

    // Сброс ошибок при переключении вкладки
    useEffect(() => {
        clearError();
        setLocalError(null);
        setRegisterFieldErrors({});
        setLoginFieldErrors({});
    }, [activeTab, clearError]);

    // Закрытие по клику вне окна
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                onClose();
            }
        };
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen, onClose]);

    // Закрытие по Escape
    useEffect(() => {
        const handleEsc = (event: KeyboardEvent) => {
            if (event.key === 'Escape') onClose();
        };
        if (isOpen) {
            document.addEventListener('keydown', handleEsc);
        }
        return () => document.removeEventListener('keydown', handleEsc);
    }, [isOpen, onClose]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLocalError(null);
        setRegisterFieldErrors({});
        setLoginFieldErrors({});
        setIsSubmitting(true);

        try {
            if (activeTab === 'login') {
                try {
                    await login({ email, password });
                    onClose();
                } catch (err: any) {
                    const data = err?.response?.data;
                    const newLoginErrors: LoginFieldErrors = {};

                    if (data?.message) {
                        newLoginErrors.general = data.message;
                    } else if (Array.isArray(data) && data.length > 0) {
                        data.forEach((error: { code: string; description: string }) => {
                            const { code, description } = error;
                            if (code === 'InvalidEmail' || code === 'DuplicateEmail') {
                                newLoginErrors.email = description;
                            } else if (code.includes('Password')) {
                                newLoginErrors.password = description;
                            } else {
                                newLoginErrors.general = newLoginErrors.general
                                    ? newLoginErrors.general + ' ' + description
                                    : description;
                            }
                        });
                    } else {
                        newLoginErrors.general = err.message || 'Ошибка входа. Попробуйте позже.';
                    }

                    setLoginFieldErrors(newLoginErrors);
                }
            } else {
                try {
                    await register({ email, password });
                    onClose();
                } catch (err: any) {
                    const data = err?.response?.data;

                    if (Array.isArray(data) && data.length > 0) {
                        const newErrors: RegisterFieldErrors = {};

                        data.forEach((error: { code: string; description: string }) => {
                            const { code, description } = error;

                            if (code === 'InvalidUserName' || code === 'DuplicateUserName') {
                                newErrors.userName = description;
                            } else if (code === 'InvalidEmail' || code === 'DuplicateEmail') {
                                newErrors.email = description;
                            } else if (code.includes('Password')) {
                                newErrors.password = description;
                            } else {
                                if (newErrors.general) {
                                    newErrors.general += ' ' + description;
                                } else {
                                    newErrors.general = description;
                                }
                            }
                        });

                        setRegisterFieldErrors(newErrors);
                    } else {
                        setLocalError('Произошла ошибка при регистрации. Попробуйте позже.');
                    }
                }
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleLoginFieldChange = (
        field: keyof LoginFieldErrors,
        value: string,
        setter: React.Dispatch<React.SetStateAction<string>>
    ) => {
        setter(value);
        if (loginFieldErrors[field]) {
            setLoginFieldErrors(prev => ({ ...prev, [field]: undefined }));
        }
    };

    const handleRegisterFieldChange = (
        field: keyof RegisterFieldErrors,
        value: string,
        setter: React.Dispatch<React.SetStateAction<string>>
    ) => {
        setter(value);
        if (registerFieldErrors[field]) {
            setRegisterFieldErrors(prev => ({ ...prev, [field]: undefined }));
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal">
                <div className="modal-content" ref={modalRef}>
                    <button className="close" onClick={onClose}>&times;</button>

                    <div className="auth-tabs">
                        <button
                            className={`tab-link ${activeTab === 'login' ? 'active' : ''}`}
                            onClick={() => setActiveTab('login')}
                        >
                            Вход
                        </button>
                        <button
                            className={`tab-link ${activeTab === 'register' ? 'active' : ''}`}
                            onClick={() => setActiveTab('register')}
                        >
                            Регистрация
                        </button>
                    </div>

                    {/* Форма входа */}
                    <div className="tab-content" style={{ display: activeTab === 'login' ? 'block' : 'none' }}>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="login-email">Email</label>
                                <input
                                    type="email"
                                    id="login-email"
                                    value={email}
                                    onChange={(e) => handleLoginFieldChange('email', e.target.value, setEmail)}
                                    required
                                />
                                {loginFieldErrors.email && (
                                    <div className="field-error">{loginFieldErrors.email}</div>
                                )}
                            </div>
                            <div className="form-group">
                                <label htmlFor="login-password">Пароль</label>
                                <input
                                    type="password"
                                    id="login-password"
                                    value={password}
                                    onChange={(e) => handleLoginFieldChange('password', e.target.value, setPassword)}
                                    required
                                />
                                {loginFieldErrors.password && (
                                    <div className="field-error">{loginFieldErrors.password}</div>
                                )}
                            </div>
                            {(error || localError || loginFieldErrors.general) && (
                                <div className="field-error">
                                    {error || localError || loginFieldErrors.general}
                                </div>
                            )}
                            <button type="submit" className="auth-btn" disabled={isSubmitting}>
                                {isSubmitting ? 'Загрузка...' : 'Войти'}
                            </button>
                        </form>
                    </div>

                    {/* Форма регистрации */}
                    <div className="tab-content" style={{ display: activeTab === 'register' ? 'block' : 'none' }}>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="register-email">Email</label>
                                <input
                                    type="email"
                                    id="register-email"
                                    value={email}
                                    onChange={(e) => handleRegisterFieldChange('email', e.target.value, setEmail)}
                                    required
                                />
                                {registerFieldErrors.email && (
                                    <div className="field-error">{registerFieldErrors.email}</div>
                                )}
                            </div>
                            <div className="form-group">
                                <label htmlFor="register-password">Пароль</label>
                                <input
                                    type="password"
                                    id="register-password"
                                    value={password}
                                    onChange={(e) => handleRegisterFieldChange('password', e.target.value, setPassword)}
                                    required
                                />
                                <small>Пароль должен содержать буквы и цифры</small>
                                {registerFieldErrors.password && (
                                    <div className="field-error">{registerFieldErrors.password}</div>
                                )}
                            </div>
                            {(error || localError || registerFieldErrors.general) && (
                                <div className="field-error">
                                    {error || localError || registerFieldErrors.general}
                                </div>
                            )}
                            <button type="submit" className="auth-btn" disabled={isSubmitting}>
                                {isSubmitting ? 'Загрузка...' : 'Зарегистрироваться'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ModalAuth;