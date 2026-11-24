import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BookingItem from './BookingItem';
import '../../styles/components/profile.css';
import { useNavigate } from 'react-router-dom';

interface CombinedBooking {
    bookingId: number;
    hotelId: number;
    roomId: number;
    checkInDate: string;
    checkOutDate: string;
    nights: number;
    totalPrice: string;
    hotelName: string;
    hotelAddress: string;
    hotelImage: string;
    roomName: string;
    guests: string;
    status: string;
    statusText: string;
    statusClass: string;
}

const statusMap: Record<number, { class: string; text: string; filter: string }> = {
    1: { class: 'status-active', text: 'Активно', filter: 'active' },
    3: { class: 'status-completed', text: 'Завершено', filter: 'completed' },
    2: { class: 'status-cancelled', text: 'Отменено', filter: 'cancelled' },
};

const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' });
};

const Booking: React.FC = () => {
    const [combinedBookings, setCombinedBookings] = useState<CombinedBooking[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeFilter, setActiveFilter] = useState('all');

    const navigate = useNavigate();

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const bookingsResponse = await axios.get('/api/booking');
                const bookings = bookingsResponse.data; // предполагаем массив

                // Собираем уникальные hotelId для параллельной загрузки отелей
                const hotelIds = [...new Set(bookings.map((b: any) => b.hotelId))];
                const hotelsResponse = await Promise.all(
                    hotelIds.map(id => axios.get(`/api/hotels/${id}`))
                );
                const hotelsMap = new Map<number, any>();
                hotelsResponse.forEach(res => {
                    hotelsMap.set(res.data.id, res.data);
                });
                console.log(bookings);
                // Для каждого бронирования запрашиваем комнату (можно тоже параллельно)
                const combined = await Promise.all(
                    bookings.map(async (booking: any) => {
                        const roomResponse = await axios.get(
                            `/api/hotels/${booking.hotelId}/Rooms/${booking.roomId}`
                        );
                        const room = roomResponse.data;
                        const hotel = hotelsMap.get(booking.hotelId);
                        const statusInfo = statusMap[booking.status] || statusMap[1];

                        const checkIn = new Date(booking.checkInDate);
                        const checkOut = new Date(booking.checkOutDate);
                        const nights = Math.round((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));

                        return {
                            bookingId: booking.id,
                            hotelId: booking.hotelId,
                            roomId: booking.roomId,
                            checkInDate: formatDate(booking.checkInDate),
                            checkOutDate: formatDate(booking.checkOutDate),
                            nights,
                            totalPrice: booking.totalPrice,
                            hotelName: hotel?.name || 'Отель',
                            hotelAddress: hotel?.address || '',
                            hotelImage: hotel?.imagesURL?.[0] || 'placeholder.jpg',
                            roomName: room.name,
                            guests: `${room.capacity} взрослых`, // при необходимости можно динамически
                            status: statusInfo.filter,
                            statusText: statusInfo.text,
                            statusClass: statusInfo.class,
                        };
                    })
                );
                setCombinedBookings(combined);
                setLoading(false);
            } catch (err) {
                setError('Не удалось загрузить бронирования');
                setLoading(false);
            }
        };

        fetchBookings();
    }, []);

    const filteredBookings = combinedBookings.filter(b =>
        activeFilter === 'all' || b.status === activeFilter
    );

    if (loading) return <div className="loader">Загрузка...</div>;
    if (error) return <div className="error">{error}</div>;



    return (
        <div className="tab-content active" id="bookings-tab">
            <div className="bookings-filters">
                <button
                    className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
                    onClick={() => setActiveFilter('all')}
                >
                    Все
                </button>
                <button
                    className={`filter-btn ${activeFilter === 'active' ? 'active' : ''}`}
                    onClick={() => setActiveFilter('active')}
                >
                    Активные
                </button>
                <button
                    className={`filter-btn ${activeFilter === 'completed' ? 'active' : ''}`}
                    onClick={() => setActiveFilter('completed')}
                >
                    Завершенные
                </button>
                <button
                    className={`filter-btn ${activeFilter === 'cancelled' ? 'active' : ''}`}
                    onClick={() => setActiveFilter('cancelled')}
                >
                    Отмененные
                </button>
            </div>
            <div className="bookings-list">
                {filteredBookings.map(booking => (
                    <BookingItem
                        key={booking.bookingId}
                        id={`BK ${booking.bookingId}`}
                        status={booking.status as any}
                        hotelImage={booking.hotelImage}
                        hotelName={booking.hotelName}
                        hotelAddress={booking.hotelAddress}
                        checkIn={booking.checkInDate}
                        checkOut={booking.checkOutDate}
                        nights={booking.nights}
                        roomType={booking.roomName}
                        guests={booking.guests}
                        price={booking.totalPrice}
                        onDownloadReceipt={() => console.log('Скачать чек', booking.bookingId)}
                        onRepeat={() => navigate(`/hotel/${booking.hotelId}`)}
                        onDetails={() => navigate(`/booking-details/${booking.bookingId}`)}
                        onRate={() => console.log('Оценить', booking.bookingId)}
                    />
                ))}
            </div>
        </div>
    );
};

export default Booking;