import { useNavigate } from 'react-router-dom';
import React from 'react';
import axios from 'axios';
import HotelCard from './HotelCard';
import { type Hotel } from './HotelCard';
import '../../../styles/components/search-form.css';
import '../../../styles/components/hotels-grid.css';
import '../../../styles/search.css';

interface ResultsProps {
    hotels: Hotel[];
    totalCount: number;
    loading: boolean;
    error: string | null;
}

const ResultsFavorite: React.FC<ResultsProps> = ({ hotels, loading, error }) => {
    const [localHotels, setLocalHotels] = React.useState<Hotel[]>(hotels);
    const navigate = useNavigate();

    React.useEffect(() => {
        setLocalHotels(hotels);
    }, [hotels]);
    
    const handleToggleFavorite = async (id: number) => {
        const hotel = localHotels.find(h => h.id === id);
        if (!hotel) return;

        const newFavoriteStatus = !hotel.isFavorite;

        setLocalHotels(prevHotels => {
            // Если переключаем в "не избранное" — убираем отель из списка
            if (!newFavoriteStatus) {
                return prevHotels.filter(h => h.id !== id);
            }
            // Если в "избранное" — оставляем, обновив флаг
            return prevHotels.map(h =>
                h.id === id ? { ...h, isFavorite: true } : h
            );
        });

        try {
            const response = await axios.post('/api/auth/favorite', {
                hotelID: id,
                type: newFavoriteStatus
            });

            console.log(response.data);
            const response_2 = await axios.get('/api/auth/favorite');
            console.log(response_2.data);
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
                <p>Вы еще не добавили отели в избранное.</p>
            </div>
        );
    }

    const openHotel = (id: number) => {
        navigate("/hotel/" + id);
    };

    return (
        <div className="results-section">

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
        </div>
    );
};

export default ResultsFavorite;