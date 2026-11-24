import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import '../../styles/favorites.css';
import { type Hotel } from './Result/HotelCard.tsx';
import ResultsFavorite from './Result/ResultsFavorite.tsx';

const FavoritePage: React.FC = () => {
    const location = useLocation();
    const [hotels, setHotels] = useState<Hotel[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchHotels = async () => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('token'); 
            const response = await axios.get('/api/auth/favorite', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setHotels(response.data || []);
            console.log(response.data);
            setTotalCount(response.data.totalCount || 0);
        } catch (error) {
            console.error('Ошибка при загрузке отелей:', error);
            setError('Не удалось загрузить отели. Попробуйте позже.');
            setHotels([]);
            setTotalCount(0);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
            fetchHotels();
    }, [location.search]);

    return (
        <main className="container">
            <div className="favorites-page">
                <h1>Избранное</h1>
                <div className="favorites-content">
                        <ResultsFavorite
                            hotels={hotels}
                            totalCount={totalCount}
                            loading={loading}
                            error={error}
                        />
                    </div>
                </div>
        </main>);
};

export default FavoritePage;