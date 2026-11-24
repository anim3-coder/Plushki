export interface User {
    id: string;
    email: string;
    userName?: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
}

export interface UpdateUserData {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    currentPassword?: string;
    newPassword?: string;
}

export interface RegisterFieldErrors {
    userName?: string;
    email?: string;
    password?: string;
    general?: string; // для неспецифичных ошибок
}

export interface AuthState {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    error: string | null;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterCredentials {
    email: string;
    password: string;
    userName?: string; // имя пользователя (необязательно)
}

export interface AuthContextType {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    error: string | null;
    login: (credentials: LoginCredentials) => Promise<void>;
    register: (credentials: RegisterCredentials) => Promise<void>;
    logout: () => void;
    clearError: () => void;
    updateUser: (data: UpdateUserData) => Promise<void>; // <-- новый метод
}