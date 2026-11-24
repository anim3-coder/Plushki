import React, { createContext, useContext, useState } from 'react';

interface ModalContextType {
    // Существующее окно авторизации
    isAuthModalOpen: boolean;
    openAuthModal: () => void;
    closeAuthModal: () => void;

    // Новое окно ошибки
    isErrorModalOpen: boolean;
    errorMessage: string;
    showErrorModal: (message: string) => void;
    closeErrorModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const useModal = () => {
    const context = useContext(ModalContext);
    if (!context) throw new Error('useModal must be used within ModalProvider');
    return context;
};

export const ModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const openAuthModal = () => setIsAuthModalOpen(true);
    const closeAuthModal = () => setIsAuthModalOpen(false);

    const showErrorModal = (message: string) => {
        setErrorMessage(message);
        setIsErrorModalOpen(true);
    };
    const closeErrorModal = () => {
        setIsErrorModalOpen(false);
        setErrorMessage(''); // очищаем сообщение при закрытии
    };

    return (
        <ModalContext.Provider
            value={{
                isAuthModalOpen,
                openAuthModal,
                closeAuthModal,
                isErrorModalOpen,
                errorMessage,
                showErrorModal,
                closeErrorModal,
            }}
        >
            {children}
        </ModalContext.Provider>
    );
};