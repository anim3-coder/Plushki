// Results.tsx
import React from 'react';
import axios from 'axios';
import HotelCard from './HotelCard';
import { type Hotel } from './HotelCard';
import '../../../styles/components/search-form.css';
import '../../../styles/components/hotels-grid.css';
import '../../../styles/search.css';
import Pagination from './Pagination';
interface ResultsProps {
    hotels: Hotel[];
    totalCount: number;
    loading: boolean;
    error: string | null;
    destination: string,
    checkIn: string,
    checkOut: string,
    openHotel?: (id: number) => void;
    page: number;
    totalPages: number;
    setPage: (id: number) => void;
}

const formatShortDate = (dateString: string): string => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const userTimezoneOffset = date.getTimezoneOffset() * 60000;
    const correctedDate = new Date(date.getTime() + userTimezoneOffset);

    return correctedDate.toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'short',
    }).replace('.', ''); // Убираем точку после месяца для компактности
};

const Results: React.FC<ResultsProps> = ({ hotels, totalCount, loading, error, destination, checkIn, checkOut, openHotel, page, totalPages, setPage }) => {
    const [localHotels, setLocalHotels] = React.useState<Hotel[]>(hotels);

    React.useEffect(() => {
        setLocalHotels(hotels);
    }, [hotels]);


    const handleToggleFavorite = async (id: number) => {
        const hotel = localHotels.find(h => h.id === id);
        if (!hotel) return;

        const newFavoriteStatus = !hotel.isFavorite;

        setLocalHotels(prevHotels =>
            prevHotels.map(h =>
                h.id === id ? { ...h, isFavorite: newFavoriteStatus } : h
            )
        );

        try {
            await axios.post('/api/auth/Favorite', {
                hotelID: id,
                type: newFavoriteStatus
            });
        } catch (error) {
            setLocalHotels(prevHotels =>
                prevHotels.map(h =>
                    h.id === id ? { ...h, isFavorite: !newFavoriteStatus } : h
                )
            );
            console.error('Ошибка обновления избранного', error);
        }
    };

    if (loading) {
        return <div className="results-section">Загрузка отелей...</div>;
    }

    if (error) {
        return <div className="results-section error">{error}</div>;
    }

    if (hotels.length === 0) {
        return (
            <div className="results-section">
                <p>Отели не найдены. Попробуйте изменить параметры поиска.</p>
            </div>
        );
    }

    const dateRange = checkIn !== '' ? `${formatShortDate(checkIn)}. - ${formatShortDate(checkOut)}.` : '';
    return (
        <div className="results-section">
            <div className="search-header">
                <h2>Отели в {destination}</h2>
                <div className="cookies-section">
                    <span className="results-count">Найдено {totalCount} отелей</span>
                    <span className="dates-info"> {dateRange}</span>
                </div>
            </div>

            <div className="hotels-grid">
                {localHotels.map(hotel => (
                    <HotelCard
                        key={hotel.id}
                        {...hotel}
                        onToggleFavorite={handleToggleFavorite}
                        openHotel={openHotel}
                    />
                ))}
            </div>

            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
    );
};

export default Results;