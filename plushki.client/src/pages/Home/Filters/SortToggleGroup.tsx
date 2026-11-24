import React from 'react';
import '../../../styles/components/search-form.css';
import '../../../styles/components/hotels-grid.css';
import '../../../styles/search.css';

export interface SortToggleGroupProps {
    value: string;
    onChange: (value: string) => void;
}

const SortToggleGroup: React.FC<SortToggleGroupProps> = ({ value, onChange }) => {
    const options = [
        { value: 'price-asc', label: 'Сначала дешевле', icon: 'fa-arrow-down' },
        { value: 'price-desc', label: 'Сначала дороже', icon: 'fa-arrow-up' },
        { value: 'rating-desc', label: 'По рейтингу (высокий)', icon: 'fa-arrow-up' },
        { value: 'rating-asc', label: 'По рейтингу (низкий)', icon: 'fa-arrow-down' },
        { value: 'reviews-desc', label: 'По отзывам (много)', icon: 'fa-arrow-up' },
        { value: 'reviews-asc', label: 'По отзывам (мало)', icon: 'fa-arrow-down' },
    ];

    return (
        <div className="filter-section">
            <h3>Сортировка</h3>
            <div className="sort-toggle-group">
                {options.map((opt) => (
                    <label key={opt.value} className="sort-toggle">
                        <input
                            type="radio"
                            name="sort"
                            value={opt.value}
                            checked={value === opt.value}
                            onChange={() => onChange(opt.value)}
                        />
                        <span>{opt.label}</span>
                        <i className={`fas ${opt.icon}`} />
                    </label>
                ))}
            </div>
        </div>
    );
};

export default SortToggleGroup;