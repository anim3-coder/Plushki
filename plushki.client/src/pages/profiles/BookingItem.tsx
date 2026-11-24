import React from 'react';

interface BookingItemProps {
    id: string;
    status: 'active' | 'completed' | 'cancelled';
    hotelImage: string;
    hotelName: string;
    hotelAddress: string;
    checkIn: string;
    checkOut: string;
    nights: number;
    roomType: string;
    guests: string;
    price: string;
    // Колбэки для действий (можно передавать из родителя)
    onDownloadReceipt?: () => void;
    onRepeat?: () => void;
    onDetails?: () => void;
    onRate?: () => void;
}

const BookingItem: React.FC<BookingItemProps> = ({
    id,
    status,
    hotelImage,
    hotelName,
    hotelAddress,
    checkIn,
    checkOut,
    nights,
    roomType,
    guests,
    price,
    onDownloadReceipt,
    onRepeat,
    onDetails,
    onRate,
}) => {
    const statusClass =
        status === 'active'
            ? 'status-active'
            : status === 'completed'
                ? 'status-completed'
                : 'status-cancelled';
    const statusText =
        status === 'active'
            ? 'Активно'
            : status === 'completed'
                ? 'Завершено'
                : 'Отменено';

    const serviceFee = Math.round(price * 5 / 100);
    const taxes = Math.round(price * 13 / 100);
    const total = price + serviceFee + taxes;

    return (
        <div className="booking-item" data-status={status}>
            <div className="booking-header">
                <div className="booking-id">#{id}</div>
                <div className={`booking-status ${statusClass}`}>{statusText}</div>
            </div>
            <div className="booking-content">
                <div className="booking-hotel">
                    <img src={hotelImage} alt={hotelName} />
                    <div className="hotel-info">
                        <h3>{hotelName}</h3>
                        <div className="hotel-location">
                            <i className="fas fa-map-marker-alt" /> {hotelAddress}
                        </div>
                    </div>
                </div>
                <div className="booking-dates">
                    <div className="date">
                        <strong>Заезд</strong>
                        <span>{checkIn}</span>
                    </div>
                    <div className="date">
                        <strong>Выезд</strong>
                        <span>{checkOut}</span>
                    </div>
                    <div className="nights">{nights} ночей</div>
                </div>
                <div className="booking-details">
                    <div className="detail">
                        <strong>Номер:</strong>
                        <span>{roomType}</span>
                    </div>
                    <div className="detail">
                        <strong>Гости:</strong>
                        <span>{guests}</span>
                    </div>
                </div>
                <div className="booking-price">
                    <div className="price">{`${total.toLocaleString()} ₽`}</div>
                    <div className="actions">
                        <button className="action-btn" onClick={onDownloadReceipt}>
                            <i className="fas fa-download" />
                            <span className="profile-text">Чек</span>
                        </button>
                        <a className="action-btn" onClick={onRepeat}>
                            <i className="fas fa-sync-alt" />
                            <span className="profile-text">Повторить</span>
                        </a>
                        {status === 'active' && (
                            <a
                                className="action-btn"
                                onClick={onDetails}
                            >
                                <i className="fas icon-more" />
                                <span className="profile-text">Детали</span>
                            </a>
                        )}
                        {status === 'completed' && (
                            <button className="action-btn" onClick={onRate}>
                                <i className="fas fa-star" />
                                <span className="profile-text">Оценить</span>
                            </button>
                        )}
                        {/* При необходимости добавить обработку для cancelled */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingItem;