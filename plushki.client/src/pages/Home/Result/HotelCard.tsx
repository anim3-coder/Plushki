import React from 'react';
import '../../../styles/components/hotels-grid.css';

export interface Hotel {
    id: number;
    name: string;
    imagesURL: string[];
    address: string;
    rating: number;
    ratingText: string;
    reviewCount: number;
    description: string;
    additionalServices: string[];
    checkInTime: string;
    checkOutTime: string;
    price: number;
    currency?: string;
    isFavorite?: boolean;
    rooms: Room[];
    amenityCategory: Amenity[];
    onToggleFavorite?: (id: number) => void;
    openHotel?: (id: number) => void;
}

export interface Room {
    id: number;
    name: string;
    imagesURL: string[];
    bedType: string;
    square: number;
    additionalServices: string[];
    pricePerNight: number;
    currency?: string;
}

export interface Amenity {
    icon: string;
    name: string;
    data: string[];
}

const HotelCard: React.FC<Hotel> = ({
    id,
    name,
    imagesURL = [],               
    address,
    rating,
    ratingText,
    reviewCount,
    additionalServices = [],
    price,
    currency = '₽',
    isFavorite = false,
    onToggleFavorite,
    openHotel,
}) => {
    const mainImage = imagesURL.length > 0 ? imagesURL[0] : 'https://molodechno-mebel.ru/wp-content/uploads/woocommerce-placeholder.png';
    const imageCount = imagesURL.length;

    const ratingClass = rating >= 4 ? 'rating-high' : rating >= 3 ? 'rating-medium' : 'rating-low';

    const handleFavoriteClick = () => {
        if (onToggleFavorite) {
            onToggleFavorite(id);
        }
    };

    const handleOpenHotel = () => {
        if (openHotel) {
            openHotel(id);
        }
    }

    const formattedRating = typeof rating === 'number' ? rating.toFixed(1) : '0.0';

    return (
        <div className="hotel-card" data-hotel-id={id}>
            <div className="hotel-image">
                <img src={mainImage} alt={name} />
                <button className="favorite-btn" onClick={handleFavoriteClick}>
                    <i className={`${isFavorite ? 'fas' : 'far'} fa-heart`} />
                </button>
                <div className="image-count">{imageCount} фото</div>
            </div>
            <div className="hotel-info">
                <h3 className="hotel-name">{name}</h3>
                <div className="hotel-location">
                    <i className="fas fa-map-marker-alt" /> {address}
                </div>
                {(reviewCount>0) && <div className="hotel-rating">
                    <span className={`rating-value ${ratingClass}`}>{formattedRating}</span>
                    <span>{ratingText} ({reviewCount} отзывов)</span>
                </div>}
                {(!(reviewCount > 0)) && <div className="hotel-rating">
                    <span>{ratingText}Нет отзывов</span>
                </div>}
                <div className="hotel-amenities">
                    {additionalServices.slice(0, 5).map((amenity, index) => (
                        <span key={index} className="amenity-tag">{amenity}</span>
                    ))}
                    {additionalServices.length > 5 && (
                        <span className="amenity-tag amenity-more">...</span>
                    )}
                </div>
            </div>
            <div className="hotel-price">
                <div className="price-container">
                    <div className="price">от {price?.toLocaleString()} {currency}</div>
                    <div className="price-desc">за 1 ночь</div>
                    <div className="taxes">Включены налоги и сборы</div>
                </div>
                <a onClick={handleOpenHotel} className="select-btn">Зайти</a>
            </div>
        </div>
    );
};

export default HotelCard;