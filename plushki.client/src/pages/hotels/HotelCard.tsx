import '../../styles/hotel-page.css';

interface HotelCardProps {
    id: number;
    name: string;
    image: string;
    location: string;
    distanceToCenter?: string;
    rating: number;
    price: number;
    onSelect: (id: number) => void;
}

const HotelCard: React.FC<HotelCardProps> = ({
    id,
    name,
    image,
    location,
    distanceToCenter,
    rating,
    price,
    onSelect
}) => {
    const ratingClass = rating >= 8 ? 'rating-high' : rating >= 6 ? 'rating-medium' : 'rating-low';

    return (
        <div className="hotel-card" data-hotel-id={id}>
            <div className="hotel-image">
                <img src={image} alt={name} />
            </div>
            <div className="hotel-info">
                <h3 className="hotel-name">{name}</h3>
                <div className="hotel-location">
                    <i className="fas fa-map-marker-alt" /> {location}
                    {distanceToCenter && `, ${distanceToCenter} до центра`}
                </div>
                <div className="hotel-rating">
                    <span className={`rating-value ${ratingClass}`}>{rating.toFixed(1)}</span>
                    <span>{rating >= 8 ? 'Превосходно' : 'Очень хорошо'}</span>
                </div>
                <div className="hotel-price">от {price.toLocaleString()} ₽</div>
                <button className="select-btn" onClick={() => onSelect(id)}>Выбрать</button>
            </div>
        </div>
    );
};

export default HotelCard;