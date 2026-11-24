import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../../styles/components/profile.css';

interface MyReview {
    id: number;
    rating: number;
    comment: string | null;
    createdAt: string;
    hotelId: number;
    hotelName: string;
    hotelCity: string;
}

interface MyReview {
    id: number;
    rating: number;
    comment: string | null;
    createdAt: string;
    hotelId: number;
    hotelName: string;
    hotelCity: string;
}

const formatDate = (iso: string): string => {
    const d = new Date(iso);
    return d.toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
};

const Stars: React.FC<{ value: number }> = ({ value }) => {
    const full = Math.floor(value);
    const hasHalf = value - full >= 0.5;
    const empty = 5 - full - (hasHalf ? 1 : 0);

    return (
        <div className="stars">
            {Array.from({ length: full }).map((_, i) => (
                <i key={`f-${i}`} className="fas fa-star" />
            ))}
            {hasHalf && <i className="fas fa-star-half-alt" />}
            {Array.from({ length: empty }).map((_, i) => (
                <i key={`e-${i}`} className="far fa-star" />
            ))}
            <span>{value.toFixed(1)}</span>
        </div>
    );
};

const Reviews: React.FC = () => {
    const [reviews, setReviews] = useState<MyReview[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;

        const fetchReviews = async () => {
            setLoading(true);
            setError(null);
            try {
                const { data } = await axios.get<MyReview[]>('/api/hotels/reviews/my');
                if (!cancelled) setReviews(data || []);
            } catch (err) {
                if (cancelled) return;
                console.error('Ошибка загрузки отзывов:', err);
                setError('Не удалось загрузить ваши отзывы');
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        void fetchReviews();
        return () => {
            cancelled = true;
        };
    }, []);

    if (loading) {
        return (
            <div className="tab-content active" id="reviews-tab">
                <p className="reviews-loading">Загрузка отзывов...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="tab-content active" id="reviews-tab">
                <p className="reviews-error">{error}</p>
            </div>
        );
    }

    if (reviews.length === 0) {
        return (
            <div className="tab-content active" id="reviews-tab">
                <div className="reviews-empty">
                    <i className="far fa-comment-dots" />
                    <p>Вы ещё не оставляли отзывов</p>
                    <Link to="/search" className="reviews-empty-link">
                        Найти отель
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="tab-content active" id="reviews-tab">
            <div className="reviews-list">
                {reviews.map((r) => (
                    <div key={r.id} className="review-item">
                        <div className="review-header">
                            <Link
                                to={`/hotel/${r.hotelId}`}
                                className="review-hotel"
                            >
                                {r.hotelName}
                                {r.hotelCity && (
                                    <span className="review-hotel-city">
                                        {' '}• {r.hotelCity}
                                    </span>
                                )}
                            </Link>
                            <div className="review-date">
                                {formatDate(r.createdAt)}
                            </div>
                        </div>

                        <div className="review-rating">
                            <Stars value={r.rating} />
                        </div>

                        {r.comment ? (
                            <div className="review-content">
                                <p>{r.comment}</p>
                            </div>
                        ) : (
                            <div className="review-content">
                                <p className="review-no-text">
                                    <i>Без комментария</i>
                                </p>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Reviews;