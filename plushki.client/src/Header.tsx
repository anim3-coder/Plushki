import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { useModal } from './context/ModalContext';
import './index.css';
import './styles/main.css';
import './styles/utils/helpers.css';
import './styles/components/header.css';

function Header() {
    const { user } = useAuth();
    const { openAuthModal } = useModal();

    const handleFavoritesClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        if (!user) {
            e.preventDefault();
            openAuthModal();
        }
    };

    const handleProfileClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        if (!user) {
            e.preventDefault();
            openAuthModal();
        }
    };

    return (
        <header id="header">
            <div className="container">
                <div className="header-top">
                    <div className="logo">
                        <Link to="/">
                            <i className="fas fa-bed"></i> Под<span>Ушко</span>
                        </Link>
                    </div>
                    <div className="user-actions">
                        <Link to="/favorites" onClick={handleFavoritesClick} className="favorites-link">
                            <i className="fas fa-heart"></i> Избранное
                        </Link>
                        {user ? (
                            <>
                                <Link to="/profile" className="profile-link" onClick={handleProfileClick}>
                                    <i className="fas fa-user"></i>{" "}
                                    {user.firstName && user.lastName
                                        ? `${user.firstName} ${user.lastName}`
                                        : user.firstName || user.lastName || user.email}
                                </Link>
                                
                                {/* <button onClick={handleLogout} className="btn">Выйти</button> */}
                            </>
                        ) : (
                            <button onClick={openAuthModal} className="btn">
                                    <i className="fas fa-user"></i> Войти
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header;