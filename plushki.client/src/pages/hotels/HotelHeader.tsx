import '../../styles/hotel-page.css';
import { useNavigate } from 'react-router-dom';
interface HotelHeaderProps {
    name: string;
    rating: number;
    reviewCount: number;
    address: string;
    isFavorite?: boolean;
    destination?: string;
    checkIn?: string;
    checkOut?: string;
    adults?: number;
    children?: number;
    onShare?: () => void;
    onToggleFavorite?: () => void;
}

const HotelHeader: React.FC<HotelHeaderProps> = ({
    name,
    rating,
    reviewCount,
    address,
    isFavorite,
    onShare,
    onToggleFavorite,
    destination,
    checkIn,
    checkOut,
    adults,
    children
}) => {
    const ratingClass = rating >= 8 ? 'rating-high' : rating >= 6 ? 'rating-medium' : 'rating-low';
    const navigate = useNavigate();
    return (
        <div className="hotel-header">
            <a href="/" className="back-button" onClick={(e) => {
                e.preventDefault(); navigate("/search", {
                    state: {
                        destination,
                        checkIn,
                        checkOut,
                        guests: { adults, children },
                    },
                });
            }}>
                <i className="fas fa-arrow-left" /> Назад к поиску
            </a>
            <h1 className="hotel-title">{name}</h1>
            <div className="hotel-meta">
                <div className="hotel-rating">
                    <span className={`rating-value ${ratingClass}`}>{rating.toFixed(1)}</span>
                    <span>{rating >= 4 ? 'Превосходно' : rating >= 3 ? 'Хорошо' : 'Плохо'}</span>
                    <span className="hotel-reviews">({reviewCount} отзывов)</span>
                </div>
                <div className="hotel-address">
                    <i className="fas fa-map-marker-alt" /> {address}
                </div>
            </div>
            <div className="hotel-actions">
                <button className="share-btn" onClick={onShare}>
                    <i className="fas fa-share-alt" /> Поделиться
                </button>
                <button
                    className={`hotel-favorite-btn ${isFavorite ? 'active' : ''}`}
                    onClick={onToggleFavorite}
                >
                    <i className="fas fa-heart" />
                </button>
            </div>
        </div>
    );
};


export default HotelHeader;