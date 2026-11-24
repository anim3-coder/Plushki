import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import '../../styles/booking-details.css';

// Интерфейсы для данных (используем те, что уже есть в проекте)
interface Hotel {
    id: number;
    name: string;
    imagesURL: string[];
    address: string;
    rating: number;
    ratingText: string;
    reviewCount: number;
    additionalServices: string[];
    checkInTime: string;
    checkOutTime: string;
}

interface Room {
    id: number;
    name: string;
    square: number;
    roomNumber: string;
    pricePerNight: number;
    capacity: number;
    bedType: string;
    hotelId: number;
    imagesURL: string[];
    additionalServices: string[];
}

interface BookingData {
    id: number;
    checkInDate: string;
    checkOutDate: string;
    email: string;
    firstName: string;
    hotelId: number;
    lastName: string;
    phone: string;
    roomId: number;
    status: number; // 1 - активно, 2 - завершено, 3 - отменено
    totalPrice: number;
}

const statusMap: Record<number, { class: string; text: string }> = {
    1: { class: 'status-active', text: 'Активно' },
    2: { class: 'status-completed', text: 'Завершено' },
    3: { class: 'status-cancelled', text: 'Отменено' },
};

const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' });
};

const calculateNights = (checkIn: string, checkOut: string) => {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    return Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
};

const BookingDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>(); // ID бронирования из маршрута
    const [booking, setBooking] = useState<BookingData | null>(null);
    const [hotel, setHotel] = useState<Hotel | null>(null);
    const [room, setRoom] = useState<Room | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [cancelling, setCancelling] = useState(false);

    const bookingId = Number(id);

    useEffect(() => {
        const fetchBookingDetails = async () => {
            try {
                // Получаем все бронирования текущего пользователя
                const bookingsResp = await axios.get('/api/booking');
                const bookings: BookingData[] = bookingsResp.data;
                const found = bookings.find(b => b.id === bookingId);
                if (!found) {
                    setError('Бронирование не найдено');
                    setLoading(false);
                    return;
                }
                setBooking(found);

                // Параллельно загружаем отель и номер
                const [hotelResp, roomResp] = await Promise.all([
                    axios.get(`/api/hotels/${found.hotelId}`),
                    axios.get(`/api/hotels/${found.hotelId}/Rooms/${found.roomId}`),
                ]);
                setHotel(hotelResp.data);
                setRoom(roomResp.data);
                setLoading(false);
            } catch (err) {
                setError('Ошибка загрузки данных бронирования');
                setLoading(false);
            }
        };

        if (bookingId) fetchBookingDetails();
    }, [bookingId]);

    const handleCancelBooking = async () => {
        if (!booking) return;
        setCancelling(true);
        try {
            await axios.put(`/api/booking/${booking.id}/cancel`);
            setBooking({ ...booking, status: 3 }); // меняем статус на "Отменено"
            setShowCancelModal(false);
        } catch (err) {
            alert('Ошибка при отмене бронирования');
        } finally {
            setCancelling(false);
        }
    };

    if (loading) return <div className="loader">Загрузка...</div>;
    if (error) return <div className="error-message">{error}</div>;
    if (!booking) return null;

    const statusInfo = statusMap[booking.status] || statusMap[1];
    const nights = calculateNights(booking.checkInDate, booking.checkOutDate);
    const pricePerNight = room?.pricePerNight || 0;
    const subtotal = pricePerNight * nights;
    const serviceFee = Math.round(subtotal * 5 / 100);
    const taxes = Math.round(subtotal * 13 / 100);
    const total = subtotal + serviceFee + taxes;

    return (
        <div>
            <main className="container">
                <div className="booking-details-page">
                    <nav className="breadcrumbs">
                        <Link to="/">Главная</Link>
                        <span>/</span>
                        <Link to="/profile">Личный кабинет</Link>
                        <span>/</span>
                        <span>Детали бронирования #{booking.id}</span>
                    </nav>

                    <div className="booking-header">
                        <h1>Бронирование #{booking.id}</h1>
                        <div className={`booking-status ${statusInfo.class}`}>{statusInfo.text}</div>
                    </div>

                    <div className="booking-layout">
                        {/* Основной контент */}
                        <div className="booking-main">
                            <section className="booking-section">
                                <h2>Информация об отеле</h2>
                                {hotel && (
                                    <div className="hotel-card-detailed">
                                        <div className="hotel-image">
                                            <img src={hotel.imagesURL[0] || 'placeholder.jpg'} alt={hotel.name} />
                                        </div>
                                        <div className="hotel-info">
                                            <h3>{hotel.name}</h3>
                                            <div className="hotel-address">
                                                <i className="fas fa-map-marker-alt" /> {hotel.address}
                                            </div>
                                            <div className="hotel-rating">
                                                <span className={`rating-value ${hotel.rating >= 8 ? 'rating-high' : 'rating-medium'}`}>{hotel.rating}</span>
                                                <span>{hotel.ratingText} ({hotel.reviewCount} отзывов)</span>
                                            </div>
                                            <div className="hotel-contact">
                                                <p><strong>Телефон:</strong> +7 (XXX) XXX-XX-XX</p>
                                                <p><strong>Email:</strong> info@example.com</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </section>

                            <section className="booking-section">
                                <h2>Информация о номере</h2>
                                {room && (
                                    <div className="room-details">
                                        <h3>{room.name}</h3>
                                        <div className="room-features">
                                            <div className="booking-feature">
                                                <i className="fas fa-bed" />
                                                <span>{room.bedType}</span>
                                            </div>
                                            <div className="booking-feature">
                                                <i className="fas fa-expand" />
                                                <span>{room.square} м²</span>
                                            </div>
                                            <div className="booking-feature">
                                                <i className="fas fa-user" />
                                                <span>{room.capacity} взрослых</span>
                                            </div>
                                            <div className="booking-feature">
                                                <i className="fas fa-wifi" />
                                                <span>Бесплатный Wi-Fi</span>
                                            </div>
                                        </div>
                                        <div className="room-amenities">
                                            <h4>Удобства в номере:</h4>
                                            <div className="amenities-list">
                                                {room.additionalServices.map((service, idx) => (
                                                    <span key={idx} className="amenity-tag">{service}</span>
                                                ))}
                                                {hotel?.additionalServices.map((service, idx) => (
                                                    <span key={`hotel-${idx}`} className="amenity-tag">{service}</span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </section>

                            <section className="booking-section">
                                <h2>Даты и гости</h2>
                                <div className="dates-guests-info">
                                    <div className="dates">
                                        <div className="date-item">
                                            <strong>Заезд</strong>
                                            <span>{formatDate(booking.checkInDate)}</span>
                                            <span>с {hotel?.checkInTime || '14:00'}</span>
                                        </div>
                                        <div className="date-item">
                                            <strong>Выезд</strong>
                                            <span>{formatDate(booking.checkOutDate)}</span>
                                            <span>до {hotel?.checkOutTime || '12:00'}</span>
                                        </div>
                                        <div className="nights">
                                            <strong>{nights} ночей</strong>
                                        </div>
                                    </div>
                                    <div className="guests">
                                        <h4>Гости:</h4>
                                        <div className="guest-list">
                                            <div className="guest">
                                                <strong>{booking.firstName} {booking.lastName}</strong>
                                                <span>Взрослый</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Стоимость */}
                            <section className="booking-section">
                                <h2>Детали оплаты</h2>
                                <div className="price-breakdown">
                                    {pricePerNight > 0 && (
                                        <>
                                            <div className="price-line">
                                                <span>{pricePerNight.toLocaleString()} ₽ × {nights} ночей</span>
                                                <span>{subtotal.toLocaleString()} ₽</span>
                                            </div>
                                            <div className="price-line">
                                                <span>Сбор за услуги</span>
                                                <span>{serviceFee.toLocaleString()} ₽</span>
                                            </div>
                                            <div className="price-line">
                                                <span>Налоги</span>
                                                <span>{taxes.toLocaleString()} ₽</span>
                                            </div>
                                        </>
                                    )}
                                    <div className="price-line total">
                                        <strong>Итого к оплате</strong>
                                        <strong>{total.toLocaleString()} ₽</strong>
                                    </div>
                                </div>
                            </section>
                        </div>

                        {/* Сайдбар с действиями */}
                        <div className="booking-sidebar">
                            <div className="sidebar-card">
                                <h3>Действия с бронированием</h3>
                                <div className="action-buttons">
                                    <button className="action-btn primary">
                                        <i className="fas fa-download" /> Скачать ваучер
                                    </button>
                                    <button className="action-btn">
                                        <i className="fas fa-print" /> Распечатать
                                    </button>
                                    <button className="action-btn">
                                        <i className="fas fa-share-alt" /> Поделиться
                                    </button>
                                    {booking.status === 1 && (
                                        <button className="action-btn warning" onClick={() => setShowCancelModal(true)}>
                                            <i className="fas fa-times" /> Отменить бронирование
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div className="sidebar-card">
                                <h3>Контакты поддержки</h3>
                                <div className="support-contacts">
                                    <a href="tel:+78001234567" className="support-link">
                                        <i className="fas fa-phone" /> 8 (800) 123-45-67
                                    </a>
                                    <a href="mailto:support@poduschko.ru" className="support-link">
                                        <i className="fas fa-envelope" /> support@poduschko.ru
                                    </a>
                                </div>
                            </div>

                            <div className="sidebar-card">
                                <h3>Политика отмены</h3>
                                <div className="cancellation-policy">
                                    {booking.status === 1 ? (
                                        <>
                                            <p>Бесплатная отмена до {formatDate(new Date(new Date(booking.checkInDate).getTime() - 24 * 60 * 60 * 1000).toISOString())}</p>
                                            <p>После этого времени при отмене взимается штраф в размере 50% от стоимости бронирования.</p>
                                        </>
                                    ) : (
                                        <p>Бронирование неактивно, отмена невозможна.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Важная информация */}
                    <section className="booking-section important-info">
                        <h2>Важная информация</h2>
                        <div className="info-grid">
                            <div className="info-item">
                                <i className="fas fa-passport" />
                                <div>
                                    <h4>Документы</h4>
                                    <p>Для регистрации необходимо удостоверение личности каждого гостя и подтверждение бронирования.</p>
                                </div>
                            </div>
                            <div className="info-item">
                                <i className="fas fa-credit-card" />
                                <div>
                                    <h4>Депозит</h4>
                                    <p>При заселении может потребоваться возвратный депозит. Сумма и условия возврата уточняются на стойке регистрации.</p>
                                </div>
                            </div>
                            <div className="info-item">
                                <i className="fas fa-parking" />
                                <div>
                                    <h4>Парковка</h4>
                                    <p>Парковочное место предоставляется по предварительному запросу. Услуга может быть платной.</p>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </main>

            {/* Модальное окно отмены */}
            {showCancelModal && (
                <div className="modal-overlay" style={{ display: 'flex' }}>
                    <div className="modal-content error">
                        <p>Вы уверены, что хотите отменить бронирование #{booking.id}?</p>
                        <div className="cancellation-warning">
                            <i className="fas fa-exclamation-triangle" />
                            <p>При отмене будет удержан штраф в размере 50% от стоимости бронирования ({(total * 0.5).toLocaleString()} ₽).</p>
                        </div>
                        <div className="action-buttons">
                            <button className="book-now-btn" onClick={() => setShowCancelModal(false)}>Не отменять</button>
                            <button className="book-now-btn" onClick={handleCancelBooking} disabled={cancelling}>
                                {cancelling ? 'Отмена...' : 'Да, отменить'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BookingDetails;