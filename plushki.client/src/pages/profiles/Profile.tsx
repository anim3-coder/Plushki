import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import '../../styles/components/profile.css';
import '../../styles/utils/helpers.css';

const Profile: React.FC = () => {
    const location = useLocation();

    const currentPath = location.pathname;


    const isActive = (path: string) => {
        return currentPath === path || currentPath.startsWith(path + '/');
    };

    return (
        <main className="container">
            <div className="profile-page">
                <h1>Личный кабинет</h1>
                <div className="profile-tabs">
                    <Link
                        to="/profile/booking"
                        className={`tab-link ${isActive('/profile/booking') ? 'active' : ''}`}
                        data-tab="bookings"
                    >
                        Мои бронирования
                    </Link>
                    <Link
                        to="/profile/settings"
                        className={`tab-link ${isActive('/profile/settings') ? 'active' : ''}`}
                        data-tab="profile"
                    >
                        Профиль
                    </Link>
                    <Link
                        to="/profile/reviews"
                        className={`tab-link ${isActive('/profile/reviews') ? 'active' : ''}`}
                        data-tab="reviews"
                    >
                        Мои отзывы
                    </Link>
                </div>

                <Outlet />
            </div>
        </main>
    );
};

export default Profile;