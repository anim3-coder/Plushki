import '../../styles/components/profile.css';
import { useAuth } from '../../context/AuthContext';
import React, { useState, useEffect } from 'react';
import { type User } from '../../types/auth';
import { useNavigate } from 'react-router-dom';

const Settings: React.FC = () => {
    const { user, updateUser, logout } = useAuth(); // предполагается наличие updateUser в контексте
    const navigate = useNavigate();
    // Локальное состояние формы
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    // Заполняем форму данными пользователя при загрузке
    useEffect(() => {
        if (user) {
            setFormData((prev) => ({
                ...prev,
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                email: user.email || '',
                phone: user.phone || '',
            }));
        }
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [id]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Валидация паролей, если заполнены
        if (formData.newPassword || formData.confirmPassword || formData.currentPassword) {
            if (formData.newPassword !== formData.confirmPassword) {
                alert('Новый пароль и подтверждение не совпадают');
                return;
            }
            if (!formData.currentPassword) {
                alert('Для смены пароля введите текущий пароль');
                return;
            }
        }

        // Формируем объект с обновлёнными данными пользователя
        const updatedUser: Partial<User> = {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phone: formData.phone,
        };

        // Если заполнены поля пароля, добавляем их в запрос (логика зависит от API)
        const passwordData = formData.currentPassword
            ? {
                currentPassword: formData.currentPassword,
                newPassword: formData.newPassword,
            }
            : {};

        try {
            // Вызываем метод обновления профиля из контекста
            await updateUser({ ...updatedUser, ...passwordData });
            alert('Изменения сохранены');
            // Очищаем поля паролей после успешного сохранения
            setFormData((prev) => ({
                ...prev,
                currentPassword: '',
                newPassword: '',
                confirmPassword: '',
            }));
        } catch {
            alert('Ошибка при сохранении');
        }
    };

    const handleLogout = (e: React.MouseEvent) => {
        e.preventDefault();
        logout();
        navigate('/');
    };

    return (
        <div className="tab-content active" id="profile-tab">
            <div className="profile-form">
                <h2>Личные данные</h2>
                <form id="profile-data-form" onSubmit={handleSubmit}>
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="firstName">Имя</label>
                            <input
                                type="text"
                                id="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="lastName">Фамилия</label>
                            <input
                                type="text"
                                id="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="phone">Телефон</label>
                            <input
                                type="tel"
                                id="phone"
                                value={formData.phone}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    <div className="form-section">
                        <h3>Смена пароля</h3>
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="currentPassword">Текущий пароль</label>
                                <input
                                    type="password"
                                    id="currentPassword"
                                    value={formData.currentPassword}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="newPassword">Новый пароль</label>
                                <input
                                    type="password"
                                    id="newPassword"
                                    value={formData.newPassword}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="confirmPassword">Подтвердите пароль</label>
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    </div>
                    <div>
                        <button type="submit" className="save-btn">
                            Сохранить изменения
                        </button>
                        <button type="button" onClick={handleLogout} className="exit-btn">
                            Выйти
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Settings;