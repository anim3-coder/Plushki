import React, { useMemo } from 'react';
import '../../../styles/components/search-form.css';
import '../../../styles/components/hotels-grid.css';
import '../../../styles/search.css';

export interface PriceRangeSliderProps {
    min: number;
    max: number;
    minLimit: number;
    maxLimit: number;
    onMinChange: (value: number) => void;
    onMaxChange: (value: number) => void;
}

const PriceRangeSlider: React.FC<PriceRangeSliderProps> = ({
    min,
    max,
    minLimit,
    maxLimit,
    onMinChange,
    onMaxChange,
}) => {
    const handleMinInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = Math.min(Number(e.target.value), max - 1);
        onMinChange(Math.max(val, minLimit));
    };

    const handleMaxInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = Math.max(Number(e.target.value), min + 1);
        onMaxChange(Math.min(val, maxLimit));
    };

    const handleMinSlider = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = Math.min(Number(e.target.value), max - 1);
        onMinChange(val);
    };

    const handleMaxSlider = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = Math.max(Number(e.target.value), min + 1);
        onMaxChange(val);
    };

    // Вычисление процентов для позиционирования трека
    const leftPercent = useMemo(() => {
        return ((min - minLimit) / (maxLimit - minLimit)) * 100;
    }, [min, minLimit, maxLimit]);

    const rightPercent = useMemo(() => {
        return ((max - minLimit) / (maxLimit - minLimit)) * 100;
    }, [max, minLimit, maxLimit]);

    const trackStyle = {
        left: `${leftPercent}%`,
        width: `${rightPercent - leftPercent}%`,
    };

    return (
        <div className="filter-section">
            <h3>Цена за ночь</h3>
            <div className="price-inputs">
                <div className="price-input">
                    <label>От</label>
                    <input
                        type="number"
                        value={min}
                        onChange={handleMinInput}
                        min={minLimit}
                        max={maxLimit}
                    />
                </div>
                <div className="price-input">
                    <label>До</label>
                    <input
                        type="number"
                        value={max}
                        onChange={handleMaxInput}
                        min={minLimit}
                        max={maxLimit}
                    />
                </div>
            </div>
            <div className="price-range-slider">
                <div className="track" style={trackStyle} />
                <input
                    type="range"
                    min={minLimit}
                    max={maxLimit}
                    value={min}
                    onChange={handleMinSlider}
                />
                <input
                    type="range"
                    min={minLimit}
                    max={maxLimit}
                    value={max}
                    onChange={handleMaxSlider}
                />
            </div>
        </div>
    );
};

export default PriceRangeSlider;