import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { type AuthContextType, type LoginCredentials, type RegisterCredentials, type User, type RegisterFieldErrors, type UpdateUserData } from '../types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [errors, setErrors] = useState<RegisterFieldErrors>({});

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        console.log(storedToken);
        if (storedToken) {
            setToken(storedToken);
            axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
            fetchUser(storedToken);
        } else {
            setIsLoading(false);
        }
    }, []);

    const fetchUser = async (currentToken: string) => {
        try {
            const response = await axios.get('/api/auth/me', {
                headers: { Authorization: `Bearer ${currentToken}` }
            });
            console.log('fetch:Успешно', response?.data);
            setUser(response.data);
        } catch (err : any) {
            const message = err?.response?.data || 'Ошибка входа';
            console.error('fetch:Ошибка', message);
            localStorage.removeItem('token');
            setToken(null);
            delete axios.defaults.headers.common['Authorization'];
        } finally {
            setIsLoading(false);
        }
    };

    const login = async (credentials: LoginCredentials) => {
        setError(null);
        setIsLoading(true);
        const response = await axios.post('/api/auth/login', credentials);
        const { token: newToken, user: userData } = response.data;
        localStorage.setItem('token', newToken);
        setToken(newToken);
        setUser(userData);
        console.log('login:Успешно', userData);
        axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
        fetchUser(newToken);
    };

    const register = async (credentials: RegisterCredentials) => {
        setErrors({}); // очищаем все ошибки
        setIsLoading(true);

        await axios.post('/api/auth/register', {
            email: credentials.email,
            password: credentials.password
        });
        await login({ email: credentials.email, password: credentials.password });
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        delete axios.defaults.headers.common['Authorization'];
    };

    const updateUser = async (data: UpdateUserData) => {
        setError(null);
        setIsLoading(true);
        try {
            const response = await axios.put('/api/auth/me', data);
            const updatedUser = response.data;
            setUser(updatedUser);
            console.log('updateUser:Успешно', updatedUser);
        } catch (err: any) {
            const message = err?.response?.data?.message || 'Ошибка обновления профиля';
            setError(message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const clearError = () => setError(null);

    const value: AuthContextType = {
        user,
        token,
        isLoading,
        error,
        login,
        register,
        logout,
        clearError,
        updateUser,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};