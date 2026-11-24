import React, { useEffect, useState } from 'react';
import axios from 'axios';
import type { HotelReviewDto, HotelReviewsResponse } from '../../types/reviews';

const PAGE_SIZE = 5;

interface HotelReviewsProps {
    hotelId: number;
}

const Stars: React.FC<{ value: number; size?: number }> = ({ value, size = 16 }) => {
    const rounded = Math.round(value);
    return (
        <span className="stars" style={{ fontSize: size }} aria-label={`${value} из 5`}>
            {[1, 2, 3, 4, 5].map((i) => (
                <i
                    key={i}
                    className={`${i <= rounded ? 'fas' : 'far'} fa-star`}
                    style={{ color: i <= rounded ? '#f5a623' : '#ccc' }}
                />
            ))}
        </span>
    );
};

const formatDate = (iso: string): string => {
    const d = new Date(iso);
    return d.toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
};

const initials = (name: string): string => {
    const parts = name.trim().split(/\s+/);
    if (parts.length === 0) return '?';
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
};

const HotelReviews: React.FC<HotelReviewsProps> = ({ hotelId }) => {
    const [reviews, setReviews] = useState<HotelReviewDto[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [totalCount, setTotalCount] = useState(0);
    const [averageRating, setAverageRating] = useState(0);
    const [distribution, setDistribution] = useState<number[]>([0, 0, 0, 0, 0]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;

        const fetchReviews = async () => {
            setLoading(true);
            setError(null);
            try {
                const { data } = await axios.get<HotelReviewsResponse>(
                    `/api/hotels/${hotelId}/reviews`,
                    { params: { page, pageSize: PAGE_SIZE } }
                );
                if (cancelled) return;

                setReviews(data.data || []);
                setTotalCount(data.totalCount || 0);
                setTotalPages(Math.ceil((data.totalCount || 0) / PAGE_SIZE));
                setAverageRating(data.averageRating ?? 0);
                setDistribution(data.ratingDistribution ?? [0, 0, 0, 0, 0]);
            } catch (err) {
                if (cancelled) return;
                console.error('Ошибка загрузки отзывов:', err);
                setError('Не удалось загрузить отзывы');
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        void fetchReviews();
        return () => { cancelled = true; };
    }, [hotelId, page]);

    const maxInDistribution = Math.max(1, ...distribution);

    return (
        <div className="hotel-details">
            <div className="detail-section background reviews-section">
                <h2>Отзывы {totalCount > 0 && <span className="reviews-count">({totalCount})</span>}</h2>

                {/* --- Сводка --- */}
                {totalCount > 0 && (
                    <div className="reviews-summary">
                        <div className="reviews-average">
                            <div className="avg-value">{averageRating.toFixed(1)}</div>
                            <Stars value={averageRating} size={18} />
                            <div className="avg-label">
                                {totalCount} {totalCount === 1 ? 'отзыв' : totalCount < 5 ? 'отзыва' : 'отзывов'}
                            </div>
                        </div>

                        <div className="reviews-distribution">
                            {[5, 4, 3, 2, 1].map((star) => {
                                const count = distribution[star - 1] ?? 0;
                                const width = (count / maxInDistribution) * 100;
                                return (
                                    <div key={star} className="distribution-row">
                                        <span className="dist-star">{star}★</span>
                                        <div className="dist-bar">
                                            <div
                                                className="dist-fill"
                                                style={{ width: `${width}%` }}
                                            />
                                        </div>
                                        <span className="dist-count">{count}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* --- Список --- */}
                {loading && <p className="reviews-muted">Загрузка отзывов...</p>}
                {error && <p className="reviews-error">{error}</p>}

                {!loading && !error && reviews.length === 0 && (
                    <div className="reviews-empty">
                        <i className="far fa-comment-dots" />
                        <p>Пока нет отзывов. Будьте первым, кто поделится впечатлениями!</p>
                    </div>
                )}

                {!loading && !error && reviews.length > 0 && (
                    <ul className="reviews-list">
                        {reviews.map((r) => (
                            <li key={r.id} className="review-card">
                                <div className="review-avatar">
                                    {initials(r.userName || 'Гость')}
                                </div>
                                <div className="review-body">
                                    <div className="review-head">
                                        <span className="review-author">
                                            {r.userName || 'Гость'}
                                        </span>
                                        <span className="review-date">
                                            {formatDate(r.createdAt)}
                                        </span>
                                    </div>
                                    <Stars value={r.rating} />
                                    {r.comment && (
                                        <p className="review-text">{r.comment}</p>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                )}

                {/* --- Пагинация --- */}
                {totalPages > 1 && (
                    <div className="reviews-pagination">
                        <button
                            type="button"
                            className="reviews-page-btn"
                            disabled={page <= 1}
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                        >
                            <i className="fas fa-chevron-left" /> Назад
                        </button>

                        <span className="reviews-page-info">
                            {page} / {totalPages}
                        </span>

                        <button
                            type="button"
                            className="reviews-page-btn"
                            disabled={page >= totalPages}
                            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        >
                            Вперёд <i className="fas fa-chevron-right" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HotelReviews;