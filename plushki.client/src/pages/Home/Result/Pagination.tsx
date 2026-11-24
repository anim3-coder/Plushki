import { useEffect } from 'react';

type PaginationProps = {
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    scrollToTop?: boolean;
};

const MAX_BUTTONS = 3;

const Pagination = ({
    page,
    totalPages,
    onPageChange,
    scrollToTop = true,
}: PaginationProps) => {
    const buildPages = (): number[] => {
        if (totalPages <= 0) return [];
        if (totalPages <= MAX_BUTTONS) {
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }

        // По умолчанию хотим [page-1, page, page+1]
        let start = page - 1;

        // У левого края — прижимаем к 1
        if (start < 1) start = 1;

        // У правого края — сдвигаем так, чтобы окно заканчивалось на totalPages
        if (start + MAX_BUTTONS - 1 > totalPages) {
            start = totalPages - MAX_BUTTONS + 1;
        }

        return Array.from({ length: MAX_BUTTONS }, (_, i) => start + i);
    };

    const pages = buildPages();
    const canPrev = page > 1;
    const canNext = page < totalPages;

    const goTo = (p: number): void => {
        if (p < 1 || p > totalPages || p === page) return;

        onPageChange(p);

        if (scrollToTop) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    // Защита: если данных стало меньше и page вышел за пределы
    useEffect(() => {
        if (totalPages > 0 && page > totalPages) {
            onPageChange(totalPages);
        }
    }, [totalPages, page, onPageChange]);

    return (
        <div className="pagination">
            {canPrev && (
                <button
                    type="button"
                    className="pagination-next"
                    onClick={() => goTo(page - 1)}
                >
                    <i className="fas fa-chevron-left" /> Предыдущая
                </button>
            )}

            {pages.map((p) => (
                <button
                    key={p}
                    type="button"
                    className={`pagination-btn${p === page ? ' active' : ''}`}
                    onClick={() => goTo(p)}
                >
                    {p}
                </button>
            ))}

            {canNext && (
                <button
                    type="button"
                    className="pagination-next"
                    onClick={() => goTo(page + 1)}
                >
                    Следующая <i className="fas fa-chevron-right" />
                </button>
            )}
        </div>
    );
};

export default Pagination;