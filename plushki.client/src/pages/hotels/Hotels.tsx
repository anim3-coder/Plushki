import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import '../../styles/hotel-page.css';
import AmenitiesSection from './AmenitiesSection'
import BookingForm from './BookingForm';
import HotelGallery from './HotelGallery';
import HotelHeader from './HotelHeader';
import RoomCard from './RoomCard';
import { type Hotel } from '../Home/Result/HotelCard';
import HotelReviews from './HotelReviews';
const HOTEL_TYPE_LABEL = (name: string): string => {
    const n = name.toLowerCase();
    if (n.startsWith('отель')) return 'Отель';
    if (n.startsWith('гостиница')) return 'Гостиница';
    if (n.startsWith('апартаменты')) return 'Апартаменты';
    if (n.startsWith('хостел')) return 'Хостел';
    return 'Отель';
};

const pluralize = (n: number, one: string, few: string, many: string): string => {
    const mod10 = n % 10;
    const mod100 = n % 100;
    if (mod10 === 1 && mod100 !== 11) return one;
    if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return few;
    return many;
};

const getHotelDescription = (hotel: Hotel): string => {
    if (hotel.description && hotel.description.trim().length > 0) {
        return hotel.description;
    }

    const type = HOTEL_TYPE_LABEL(hotel.name ?? '');
    const parts: string[] = [];

    // «Отель «Солнце» в Москве»
    const location = [hotel.city, hotel.country]
        .filter(Boolean)
        .filter((v, i, arr) => arr.indexOf(v) === i) // на случай city === country
        .join(', ');

    parts.push(
        location
            ? `${type} «${hotel.name}» в ${location}`
            : `${type} «${hotel.name}»`
    );

    // Адрес
    if (hotel.address && hotel.address.trim()) {
        parts.push(`Адрес: ${hotel.address.trim()}.`);
    }

    // Рейтинг и отзывы
    if (hotel.rating > 0 && hotel.reviewCount > 0) {
        parts.push(
            `Средняя оценка гостей — ${hotel.rating.toFixed(1)} из 5 ` +
            `по ${hotel.reviewCount} ` +
            `${pluralize(hotel.reviewCount, 'отзыву', 'отзывам', 'отзывам')}.`
        );
    } else if (hotel.rating > 0) {
        parts.push(`Средняя оценка гостей — ${hotel.rating.toFixed(1)} из 5.`);
    }

    // Номера и цены
    if (hotel.rooms && hotel.rooms.length > 0) {
        const prices = hotel.rooms.map((r) => r.pricePerNight);
        const minPrice = Math.min(...prices);

        if (minPrice > 0) {
            parts.push(
                `К вашим услугам ${hotel.rooms.length} ` +
                `${pluralize(hotel.rooms.length, 'номер', 'номера', 'номеров')} ` +
                `стоимостью от ${minPrice.toLocaleString('ru-RU')} ₽ за ночь.`
            );
        } else {
            parts.push(
                `К вашим услугам ${hotel.rooms.length} ` +
                `${pluralize(hotel.rooms.length, 'номер', 'номера', 'номеров')}.`
            );
        }
    }

    // Время заезда/выезда
    if (hotel.checkInTime || hotel.checkOutTime) {
        const ci = hotel.checkInTime ?? '—';
        const co = hotel.checkOutTime ?? '—';
        parts.push(`Заезд с ${ci}, выезд до ${co}.`);
    }

    // Топ-удобства (первые 3 из категорий)
    const topAmenities = (hotel.amenityCategory ?? [])
        .flatMap((c) => c.data ?? [])
        .filter((s) => !/^[^:]+:\d+$/.test(s)) // без "Спальня:1"
        .slice(0, 3);

    if (topAmenities.length > 0) {
        parts.push(`Из удобств: ${topAmenities.join(', ')}.`);
    }

    return parts.join(' ');
};

const HotelPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const location = useLocation();

    const [hotel, setHotel] = useState<Hotel | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const routeState = location.state as {
        destination?: string;
        checkIn?: string;
        checkOut?: string;
        guests?: { adults: number; children: number };
    } || {};

    const [destination] = useState(() => routeState.destination || '');
    const [checkIn, setCheckIn] = useState(() => routeState.checkIn || '');
    const [checkOut, setCheckOut] = useState(() => routeState.checkOut || '');
    const [adults, setAdults] = useState(() => routeState.guests?.adults ?? 2);
    const [children, setChildren] = useState(() => routeState.guests?.children ?? 0);
    const [price, setPrice] = useState<number>(() => {
        // Защита от отсутствия hotel или rooms
        const rooms = hotel?.rooms;
        if (!rooms || rooms.length === 0) {
            return 0; // или какое-то значение по умолчанию, например Infinity или null
        }
        // Находим минимальную цену за ночь
        const minPrice = Math.min(...rooms.map(room => room.pricePerNight));
        return minPrice;
    });

    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const today = `${year}-${month}-${day}`;

    useEffect(() => {
        const fetchHotel = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await axios.get(`/api/hotels/${id}`);
                console.log(response.data);
                setHotel(response.data);
            } catch (err) {
                console.error('Ошибка загрузки отеля:', err);
                setError('Не удалось загрузить информацию об отеле.');
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchHotel();
    }, [id]);

    useEffect(() => {
        const rooms = hotel?.rooms;
        if (!rooms || rooms.length === 0) {
            setPrice(0); // или другое значение по умолчанию
            return;
        }
        const minPrice = Math.min(...rooms.map(room => room.pricePerNight));
        setPrice(minPrice);
    }, [hotel?.rooms]); // Зависимость от hotel?.rooms

    const handleCheckInChange = (date: string) => setCheckIn(date);
    const handleCheckOutChange = (date: string) => setCheckOut(date);
    const handleAdultsChange = (count: number) => setAdults(count);
    const handleChildrenChange = (count: number) => setChildren(count);

    const handleRoomSelect = (roomId: number) => {
        if (!checkIn || !checkOut) {
            alert('Пожалуйста, выберите даты заезда и выезда');
            return;
        }
        navigate(`/booking/${hotel?.id}/${roomId}?destination=${destination}&checkIn=${checkIn}&checkOut=${checkOut}&adults=${adults}&children=${children}`);
    };

    const toggleFavorite = async () => {
        if (hotel == null)
            return;
        const newFavoriteStatus = !hotel.isFavorite;
        setHotel({ ...hotel, isFavorite: newFavoriteStatus });

        try {
            await axios.post('/api/auth/Favorite', {
                hotelID: id,
                type: newFavoriteStatus
            });
        } catch (error) {
            console.error('Ошибка обновления избранного', error);
        }
    };

    if (loading) return <div className="container">Загрузка...</div>;
    if (error || !hotel) return <div className="container error">{error || 'Отель не найден'}</div>;

    return (
        <main className="container">
            <div className="hotel-page">
                <HotelHeader
                    name={hotel.name}
                    rating={hotel.rating}
                    reviewCount={hotel.reviewCount}
                    address={hotel.address}
                    isFavorite={hotel.isFavorite}
                    onShare={() => {
                        navigator.clipboard?.writeText(window.location.href);
                        alert('Ссылка скопирована!');
                    }}
                    onToggleFavorite={toggleFavorite}
                    destination={destination}
                    checkIn={checkIn}
                    checkOut={checkOut}
                    adults={adults}
                    children={children}
                />

                <HotelGallery images={hotel.imagesURL} />

                <BookingForm
                    checkIn={checkIn}
                    checkOut={checkOut}
                    adults={adults}
                    children={children}
                    basePrice={price}
                    onCheckInChange={handleCheckInChange}
                    onCheckOutChange={handleCheckOutChange}
                    onAdultsChange={handleAdultsChange}
                    onChildrenChange={handleChildrenChange}
                />

                <div className="rooms-section">
                    <h2>Доступные номера</h2>
                    <div className="rooms-grid">
                        {hotel.rooms.map(room => (
                            <RoomCard
                                key={room.id}
                                name={room.name}
                                imagesURL={room.imagesURL}
                                bedType={room.bedType}
                                square={room.square}
                                additionalServices={room.additionalServices}
                                pricePerNight={room.pricePerNight}
                                onSelect={() => handleRoomSelect(room.id)}
                            />
                        ))}
                    </div>
                </div>
                <div className="hotel-details">
                    <div className="detail-section background">
                        <h2>Об отеле</h2>
                        <i>{getHotelDescription(hotel)}</i>
                    </div>
                    <AmenitiesSection categories={hotel.amenityCategory} />
                </div>
                <div className="hotel-details">
                    <div className="detail-section background">
                        <h2>Об отеле</h2>
                        <p className="hotel-description">{getHotelDescription(hotel)}</p>
                    </div>
                    <AmenitiesSection categories={hotel.amenityCategory} />
                </div>

                {/* ↓ новая секция */}
                <HotelReviews hotelId={hotel.id} />

                <div className="hotel-details">
                    <div className="detail-section background">
                        <h2>Полезная информация</h2>
                        <p><i className="fas fa-sign-in-alt" style={{ paddingRight: '10px' }}></i>Время заезда: {hotel.checkInTime}</p>
                        <p><i className="fas fa-sign-out-alt" style={{ paddingRight: '10px' }}></i>Время выезда: {hotel.checkOutTime}</p>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default HotelPage;