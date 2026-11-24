import React, { useState, FormEvent, useEffect } from 'react';
import { useModal } from '../../context/ModalContext.tsx';
import { type Hotel, type Room } from '../Home/Result/HotelCard.tsx';
import { useParams, useSearchParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import '../../styles/booking.css';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext.tsx';

const HotelInfo: React.FC<{ hotel: Hotel }> = ({ hotel }) => {
    const ratingClass = hotel.rating >= 4.5 ? 'rating-high' : hotel.rating >= 3 ? 'rating-medium' : 'rating-low';
    return (
        <div className="hotel-info">
            <h3>{hotel.name}</h3>
            <div className="hotel-address">
                <i className="fas fa-map-marker-alt"></i> {hotel.address}
            </div>
            <div className="hotel-rating">
                <span className={`rating-value ${ratingClass}`}>{hotel.rating}</span>
                <span>{hotel.ratingText} ({hotel.reviewCount} отзывов)</span>
            </div>
        </div>
    );
};

const AMENITY_ICONS: Record<string, string> = {
    'wi-fiвномере': 'fa-wifi',
    'бесплатныйwi-fiвномере': 'fa-wifi',
    'платныйwi-fiвномере': 'fa-wifi',
    'wi-fiнавсейтерритории': 'fa-wifi',
    'бесплатныйwi-fiнавсейтерритории': 'fa-wifi',
    'платныйwi-fiнавсейтерритории': 'fa-wifi',
    'кондиционер': 'fa-wind',
    'телевизор': 'fa-tv',
    'холодильник': 'fa-snowflake',
    'чай/кофе': 'fa-mug-hot',
    'сейф': 'fa-lock',
    'фен': 'fa-wind',
    'утюг': 'fa-tshirt',
    'санузел': 'fa-bath',
    'ванная': 'fa-bath',
    'душ': 'fa-shower',
    'вентилятор': 'fa-fan',
    'стиральнаямашина': 'fa-soap',
    'кроваткадлядетей': 'fa-baby',
    'кухня': 'fa-utensils',
    'балкон': 'fa-door-open',
};

const normalize = (s: string) => s.toLowerCase().replace(/\s+/g, '');

const isCountEntry = (s: string) => /^[^:]+:\d+$/.test(s.trim());

const getAmenityIcon = (amenity: string): string | null =>
    AMENITY_ICONS[normalize(amenity)] ?? null;

const MAX_AMENITIES = 6;

interface RoomInfoProps {
    room: Room;
    adults: number;
    child: number;
}

const RoomInfo: React.FC<RoomInfoProps> = ({ room, adults, child }) => {
    // Отбрасываем "Двуспальная кровать:2", "Спальня:1" — это не удобства
    const pureAmenities = (room.additionalServices ?? []).filter(
        (a) => a && !isCountEntry(a)
    );

    const visible = pureAmenities.slice(0, 6);
    const hiddenCount = pureAmenities.length - visible.length;

    return (
        <div className="room-info">
            <h4>{room.name}</h4>

            <div className="booking-room-details">
                <div className="booking-detail">
                    <i className="fas fa-bed" />
                    <span>{room.bedType}</span>
                </div>
                <div className="booking-detail">
                    <i className="fas fa-expand" />
                    <span>{room.square} м²</span>
                </div>
                <div className="booking-detail">
                    <i className="fas fa-user" />
                    <span>{adults} взрослых</span>
                    {child > 0 && <span>{child} детей</span>}
                </div>
            </div>

            {visible.length > 0 && (
                <div className="room-amenities">
                    {visible.map((amenity) => {
                        const icon = getAmenityIcon(amenity);
                        return (
                            <span key={amenity} className="amenity-tag">
                                {icon && <i className={`fas ${icon}`} />}
                                {amenity}
                            </span>
                        );
                    })}

                    {hiddenCount > 0 && (
                        <span
                            className="amenity-tag amenity-more"
                            title={pureAmenities.slice(MAX_AMENITIES).join(', ')}
                        >
                            +{hiddenCount}
                        </span>
                    )}
                </div>
            )}
        </div>
    );
};

const DateInfo: React.FC<{ checkIn: string; checkOut: string; checkInTime: string; checkOutTime: string }> = ({
    checkIn, checkOut, checkInTime, checkOutTime
}) => {
    const nights = (new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 3600 * 24);
    return (
        <div className="dates-info">
            <div className="date-range">
                <div className="date">
                    <strong>Заезд</strong>
                    <span>{checkIn}</span>
                    <span>{checkInTime}</span>
                </div>
                <div className="date">
                    <strong>Выезд</strong>
                    <span>{checkOut}</span>
                    <span>{checkOutTime}</span>
                </div>
            </div>
            <div className="nights-count">{nights} ночей</div>
        </div>
    );
};

const PriceDetails: React.FC<{ room: Room; nights: number; serviceFeePercent?: number; taxPercent?: number }> = ({
    room, nights, serviceFeePercent = 5, taxPercent = 10
}) => {
    const pricePerNight = room.pricePerNight;
    const subtotal = pricePerNight * nights;
    const serviceFee = Math.round(subtotal * 5 / 100);
    const taxes = Math.round(subtotal * 13 / 100);
    const total = subtotal + serviceFee + taxes;
    const currency = room.currency || '₽';

    return (
        <div className="price-details">
            <h4>Детали оплаты</h4>
            <div className="price-line">
                <span>{pricePerNight.toLocaleString()} {currency} × {nights} ночей</span>
                <span>{subtotal.toLocaleString()} {currency}</span>
            </div>
            <div className="price-line">
                <span>Сбор за услуги</span>
                <span>{serviceFee.toLocaleString()} {currency}</span>
            </div>
            <div className="price-line">
                <span>Налоги</span>
                <span>{taxes.toLocaleString()} {currency}</span>
            </div>
            <div className="price-line total">
                <strong>Итого</strong>
                <strong>{total.toLocaleString()} {currency}</strong>
            </div>
        </div>
    );
};

const CancellationPolicy: React.FC<{ cancellationDeadline?: string }> = ({ cancellationDeadline }) => {
    const deadline = cancellationDeadline || 'за день до заезда';
    return (
        <div className="cancellation-policy">
            <h4>Условия отмены</h4>
            <p>Бесплатная отмена до {deadline}. После этого времени при отмене взимается штраф в размере 50% от стоимости бронирования.</p>
        </div>
    );
};

interface PaymentMethodsProps {
    paymentMethod: 'now' | 'later' | 'hotel';
    onPaymentMethodChange: (method: 'now' | 'later' | 'hotel') => void;
    cardData: {
        number: string;
        expiry: string;
        cvc: string;
        name: string;
    };
    onCardDataChange: (data: Partial<PaymentMethodsProps['cardData']>) => void;
    errors?: Record<string, string>;
}

const PaymentMethods: React.FC<PaymentMethodsProps> = ({
    paymentMethod,
    onPaymentMethodChange,
    cardData,
    onCardDataChange,
    errors = {},
}) => {
    return (
        <div className="form-section">
            <h3>Способ оплаты</h3>
            <div className="payment-methods">
                <div className="payment-method">
                    <input
                        type="radio"
                        id="pay-now"
                        name="payment-method"
                        value="now"
                        checked={paymentMethod === 'now'}
                        onChange={() => onPaymentMethodChange('now')}
                    />
                    <label htmlFor="pay-now">
                        <i className="fas fa-credit-card"></i>
                        <span>Оплатить сейчас</span>
                    </label>
                </div>
                <div className="payment-method">
                    <input
                        type="radio"
                        id="pay-later"
                        name="payment-method"
                        value="later"
                        checked={paymentMethod === 'later'}
                        onChange={() => onPaymentMethodChange('later')}
                    />
                    <label htmlFor="pay-later">
                        <i className="fas fa-clock"></i>
                        <span>Отложенный платеж</span>
                    </label>
                </div>
                <div className="payment-method">
                    <input
                        type="radio"
                        id="pay-hotel"
                        name="payment-method"
                        value="hotel"
                        checked={paymentMethod === 'hotel'}
                        onChange={() => onPaymentMethodChange('hotel')}
                    />
                    <label htmlFor="pay-hotel">
                        <i className="fas fa-building"></i>
                        <span>Оплата в отеле</span>
                    </label>
                </div>
            </div>

            {paymentMethod === 'now' && (
                <div className="payment-details">
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="card-number">Номер карты</label>
                            <input
                                type="text"
                                id="card-number"
                                placeholder="0000 0000 0000 0000"
                                value={cardData.number}
                                onChange={(e) => onCardDataChange({ number: e.target.value })}
                            />
                            {errors.number && <div className="error-msg">{errors.number}</div>}
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="card-expiry">Срок действия</label>
                            <input
                                type="text"
                                id="card-expiry"
                                placeholder="ММ/ГГ"
                                value={cardData.expiry}
                                onChange={(e) => onCardDataChange({ expiry: e.target.value })}
                            />
                            {errors.expiry && <div className="error-msg">{errors.expiry}</div>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="card-cvc">CVC</label>
                            <input
                                type="text"
                                id="card-cvc"
                                placeholder="000"
                                value={cardData.cvc}
                                onChange={(e) => onCardDataChange({ cvc: e.target.value })}
                            />
                            {errors.cvc && <div className="error-msg">{errors.cvc}</div>}
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="card-name">Имя владельца карты</label>
                            <input
                                type="text"
                                id="card-name"
                                value={cardData.name}
                                onChange={(e) => onCardDataChange({ name: e.target.value })}
                            />
                            {errors.name && <div className="error-msg">{errors.name}</div>}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const Confirmation: React.FC = () => {
    return (
        <div className="form-section">
            <h3>Подтверждение</h3>
            <div className="confirmation">
                <label className="checkbox-label">
                    <input type="checkbox" id="terms-agree" required />
                    <span>Я прочитал и соглашаюсь с <a href="terms.html">правилами бронирования</a> и <a href="privacy.html">политикой конфиденциальности</a></span>
                </label>
                <p className="notice">После подтверждения бронирования на указанный email будет отправлено письмо с деталями заказа.</p>
            </div>
        </div>
    );
};

const BookingForm: React.FC<{ adults: number; children: number; onSubmit: (data: any) => void }> = ({ adults, children, onSubmit }) => {
    const { user } = useAuth();

    const [firstName, setFirstName] = useState(user?.firstName);
    const [lastName, setLastName] = useState(user?.lastName);
    const [email, setEmail] = useState(user?.email);
    const [phone, setPhone] = useState(user?.phone);
    const [paymentMethod, setPaymentMethod] = useState<'now' | 'later' | 'hotel'>('now');
    const [cardData, setCardData] = useState({
        number: '',
        expiry: '',
        cvc: '',
        name: '',
    });
    const [cardErrors, setCardErrors] = useState<Record<string, string>>({});


    useEffect(() => {
        if (user) {
            setFirstName(user.firstName ?? '');
            setLastName(user.lastName ?? '');
            setEmail(user.email ?? '');
            setPhone(user.phone ?? '');
        }
    }, [user]);

    const validateCard = (): boolean => {
        const errors: Record<string, string> = {};
        if (!cardData.number.trim()) {
            errors.number = 'Введите номер карты';
        } else if (!/^\d{4}\s?\d{4}\s?\d{4}\s?\d{4}$/.test(cardData.number.replace(/\s/g, ''))) {
            errors.number = 'Неверный формат номера карты';
        }
        if (!cardData.expiry.trim()) {
            errors.expiry = 'Введите срок действия';
        } else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(cardData.expiry)) {
            errors.expiry = 'Формат ММ/ГГ';
        }
        if (!cardData.cvc.trim()) {
            errors.cvc = 'Введите CVC';
        } else if (!/^\d{3,4}$/.test(cardData.cvc)) {
            errors.cvc = 'CVC должен содержать 3 или 4 цифры';
        }
        if (!cardData.name.trim()) {
            errors.name = 'Введите имя владельца карты';
        }
        setCardErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (paymentMethod === 'now' && !validateCard()) {
            // Прокрутим к ошибкам
            const firstError = document.querySelector('.error-msg');
            firstError?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return;
        }
        const formData = {
            firstName,
            lastName,
            email,
            phone,
            paymentMethod,
            ...(paymentMethod === 'now' && { cardData }),
        };
        onSubmit(formData);
    };

    return (
        <div className="booking-form">
            <h2>Оформление бронирования</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-section">
                    <h3>Ваши данные</h3>
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="first-name">Имя</label>
                            <input type="text" id="first-name" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                            {cardErrors.firstName && <div className="error-msg">{cardErrors.firstName}</div>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="last-name">Фамилия</label>
                            <input type="text" id="last-name" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
                            {cardErrors.lastName && <div className="error-msg">{cardErrors.lastName}</div>}
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="phone">Телефон</label>
                            <input type="tel" id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} required />
                        </div>
                    </div>
                </div>

                <PaymentMethods
                    paymentMethod={paymentMethod}
                    onPaymentMethodChange={setPaymentMethod}
                    cardData={cardData}
                    onCardDataChange={(updates) => setCardData(prev => ({ ...prev, ...updates }))}
                    errors={cardErrors}
                />

                <Confirmation />

                <button type="submit" className="book-now-btn">Забронировать</button>
            </form>
        </div>
    );
};

const BookingSummary: React.FC<{
    hotel: Hotel;
    room: Room;
    checkIn: string;
    checkOut: string;
    adults: number;
    child: number;
}> = ({ hotel, room, checkIn, checkOut, adults, child }) => {
    const nights = Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 3600 * 24));
    console.log(room);
    return (
        <div className="booking-summary-pay">

            <h2>Детали бронирования</h2>
            <HotelInfo hotel={hotel} />
            <RoomInfo room={room} child={child} adults={adults} />
            <DateInfo
                checkIn={checkIn}
                checkOut={checkOut}
                checkInTime={hotel.checkInTime}
                checkOutTime={hotel.checkOutTime}
            />
            <PriceDetails room={room} nights={nights} />
            <CancellationPolicy />
        </div>
    );
};

const BookingPage: React.FC = () => {
    const { showErrorModal } = useModal();
    const { hotelId, roomId } = useParams<{ hotelId: string; roomId: string }>();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const checkIn = searchParams.get('checkIn') || '';
    const checkOut = searchParams.get('checkOut') || '';
    const adults = Number(searchParams.get('adults') || 2);
    const children = Number(searchParams.get('children') || 0);

    const [hotel, setHotel] = useState<Hotel | null>(null);
    const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const nights = (new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 3600 * 24);
    const pricePerNight = selectedRoom?.pricePerNight;
    const subtotal = pricePerNight * nights;
    const serviceFee = Math.round(subtotal * 5 / 100);
    const taxes = Math.round(subtotal * 13 / 100);
    const total = subtotal + serviceFee + taxes;



    useEffect(() => {
    if (!hotelId || !roomId) return;

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const hotelData = await axios.get(`/api/Hotels/${hotelId}`);
            const roomData = await axios.get(`/api/hotels/${hotelId}/Rooms/${roomId}`);

            const raw = hotelData.data;

            const rawReviewCount =
                raw.reviewCount ??
                (Array.isArray(raw.reviews) ? raw.reviews.length : 0);

            const normalizedHotel: Hotel = {
                ...raw,
                reviewCount:
                    Number(rawReviewCount) > 0 ? String(rawReviewCount) : '',
                currency: raw.currency ?? '₽',
                ratingText:
                    raw.ratingText ??
                    (raw.rating >= 4.5 ? 'Превосходно'
                     : raw.rating >= 4 ? 'Отлично'
                     : raw.rating >= 3 ? 'Хорошо'
                     : raw.rating >= 2 ? 'Неплохо'
                     : 'Плохо'),
            };

            setHotel(normalizedHotel);
            setSelectedRoom(roomData.data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Ошибка загрузки');
        } finally {
            setLoading(false);
        }
    };

    fetchData();
}, [hotelId, roomId]);

    const handleBookingSubmit = async (formData: any) => {
        
        const payload = {
            hotelId: hotelId,
            roomId: roomId,
            checkInDate: checkIn,
            checkOutDate: checkOut,
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phone: formData.phone,
            totalPrice: total,
        };

        try {
            const response = await axios.post('/api/booking', payload);
            navigate(`/booking-details/${response.data.id}`)
        } catch (error: any) {
            console.log(error.response);
            showErrorModal(error.response.data);
        }
    };

    if (loading) return <div className="container">Загрузка...</div>;
    if (error) return <div className="container">Ошибка: {error}</div>;
    if (!hotel || !selectedRoom) return <div className="container">Данные не найдены</div>;

    return (
        <main className="container">
            <div className="booking-page">
                <a href="/" className="back-button" onClick={(e) => {
                    e.preventDefault(); navigate(`/hotel/${hotel?.id}`, {
                        state: {
                            checkIn,
                            checkOut,
                            guests: { adults, children },
                        },
                    });
                }}>
                    <i className="fas fa-arrow-left" /> Назад к поиску
                </a>
                <div className="booking-layout">
                    <BookingSummary
                        hotel={hotel}
                        room={selectedRoom}
                        checkIn={checkIn}
                        checkOut={checkOut}
                        child={children}
                        adults={adults}
                    />
                    <BookingForm
                        adults={adults}
                        children={children}
                        onSubmit={handleBookingSubmit}
                    />
                </div>
            </div>
        </main>
    );
};

export default BookingPage;