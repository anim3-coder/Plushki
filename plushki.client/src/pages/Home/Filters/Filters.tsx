import React, { useState, useCallback } from 'react';
import SortToggleGroup from './SortToggleGroup.tsx';
import PriceRangeSlider from './PriceRangeSlider.tsx';
import RadioGroup from './RadioGroup.tsx';
import CheckboxGroup from './CheckboxGroup.tsx';
import '../../../styles/components/search-form.css';
import '../../../styles/components/hotels-grid.css';
import '../../../styles/search.css';

// Типы для состояния фильтров
interface FiltersState {
    sort: string;
    price: {
        min: number;
        max: number;
    };
    bedType: string;
    petsAllowed: boolean;
    familyFriendly: boolean;
    activities: {
        restaurant: boolean;
        cafe: boolean;
        pool: boolean;
        sauna: boolean;
        spa: boolean;
        fitness: boolean;
        beach: boolean;
        waterpark: boolean;
        playroom: boolean;
    };
    amenities: {
        // Интернет
        wifiFreeRoom: boolean;
        wifiPaidRoom: boolean;
        wifiFreeArea: boolean;
        wifiPaidArea: boolean;
        // Парковка
        parkingFree: boolean;
        parkingPaid: boolean;
        parkingDisabled: boolean;
        // Вещи в номере
        ac: boolean;
        tv: boolean;
        fridge: boolean;
        teaCoffee: boolean;
        safe: boolean;
        hairdryer: boolean;
        iron: boolean;
        bathroom: boolean;
        fan: boolean;
        washingMachine: boolean;
        crib: boolean;
        // Питание
        restaurantBar: boolean;
        fullBoard: boolean;
        halfBoard: boolean;
        breakfast: boolean;
        buffet: boolean;
        // Уборка
        dailyCleaning: boolean;
        weeklyCleaning: boolean;
        // Оплата
        cash: boolean;
        card: boolean;
        sbp: boolean;
    };
}

// Начальное состояние
const initialState: FiltersState = {
    sort: 'price-asc',
    price: {
        min: 500,
        max: 50000,
    },
    bedType: 'any',
    petsAllowed: false,
    familyFriendly: false,
    activities: {
        restaurant: false,
        cafe: false,
        pool: false,
        sauna: false,
        spa: false,
        fitness: false,
        beach: false,
        waterpark: false,
        playroom: false,
    },
    amenities: {
        wifiFreeRoom: false,
        wifiPaidRoom: false,
        wifiFreeArea: false,
        wifiPaidArea: false,
        parkingFree: false,
        parkingPaid: false,
        parkingDisabled: false,
        ac: false,
        tv: false,
        fridge: false,
        teaCoffee: false,
        safe: false,
        hairdryer: false,
        iron: false,
        bathroom: false,
        fan: false,
        washingMachine: false,
        crib: false,
        restaurantBar: false,
        fullBoard: false,
        halfBoard: false,
        breakfast: false,
        buffet: false,
        dailyCleaning: false,
        weeklyCleaning: false,
        cash: false,
        card: false,
        sbp: false,
    },
};

interface CheckboxWithIconGroupProps {
    options: { name: string; label: string; icon: string }[];
    values: Record<string, boolean>;
    onChange: (name: string, checked: boolean) => void;
}

const CheckboxWithIconGroup: React.FC<CheckboxWithIconGroupProps> = ({ options, values, onChange }) => (
    <div className="checkbox-group compact-checkboxes">
        {options.map((opt) => (
            <label key={opt.name} className="checkbox-with-icon">
                <input
                    type="checkbox"
                    name={opt.name}
                    checked={values[opt.name] || false}
                    onChange={(e) => onChange(opt.name, e.target.checked)}
                />
                <i className={`fas ${opt.icon}`} />
                <span>{opt.label}</span>
            </label>
        ))}
    </div>
);

// Основной компонент
const Filters: React.FC = ({ onParamsChange }) => {
    const [filters, setFilters] = useState<FiltersState>(initialState);

    // Обработчики обновления простых полей
    const handleSortChange = (sort: string) => setFilters((prev) => ({ ...prev, sort }));

    const handlePriceMinChange = (min: number) =>
        setFilters((prev) => ({ ...prev, price: { ...prev.price, min } }));

    const handlePriceMaxChange = (max: number) =>
        setFilters((prev) => ({ ...prev, price: { ...prev.price, max } }));

    const handleBedTypeChange = (bedType: string) => setFilters((prev) => ({ ...prev, bedType }));

    const handleSimpleToggle = (field: keyof Pick<FiltersState, 'petsAllowed' | 'familyFriendly'>) =>
        setFilters((prev) => ({ ...prev, [field]: !prev[field] }));

    const handleActivityChange = (name: string, checked: boolean) =>
        setFilters((prev) => ({
            ...prev,
            activities: { ...prev.activities, [name]: checked },
        }));

    const handleAmenityChange = (name: string, checked: boolean) =>
        setFilters((prev) => ({
            ...prev,
            amenities: { ...prev.amenities, [name]: checked },
        }));

    // Сброс всех фильтров
    const handleReset = () => setFilters(initialState);

    // Формирование JSON для отправки на сервер (массив строк параметров запроса)
    const buildQueryParams = useCallback((): string[] => {
        const params: string[] = [];

        params.push(`sort=${filters.sort}`);        

        // Цена
        if (filters.price.min !== initialState.price.min) {
            params.push(`price_min=${filters.price.min}`);
        }
        if (filters.price.max !== initialState.price.max) {
            params.push(`price_max=${filters.price.max}`);
        }

        // Тип кровати
        if (filters.bedType !== 'any') {
            params.push(`bed_type=${filters.bedType}`);
        }

        // Особенности размещения
        if (filters.petsAllowed) params.push('pets_allowed=true');
        if (filters.familyFriendly) params.push('family_friendly=true');

        // Активности
        Object.entries(filters.activities).forEach(([key, value]) => {
            if (value) params.push(`activity_${key}=true`);
        });

        // Удобства
        Object.entries(filters.amenities).forEach(([key, value]) => {
            if (value) params.push(`amenity_${key}=true`);
        });

        return params;
    }, [filters]);

    const handleApply = () => {
        const queryArray = buildQueryParams();
        console.log(queryArray);
        onParamsChange(queryArray);
    };

    // Опции для радио-групп и чекбоксов
    const bedTypeOptions = [
        { value: 'any', label: 'Неважно' },
        { value: 'single', label: 'Односпальная' },
        { value: 'double', label: 'Двуспальная' },
        { value: 'king', label: 'Широкая кровать' },
    ];

    const activityOptions = [
        { name: 'restaurant', label: 'Ресторан', icon: 'fa-utensils' },
        { name: 'cafe', label: 'Кафе', icon: 'fa-coffee' },
        { name: 'pool', label: 'Бассейн', icon: 'fa-swimming-pool' },
        { name: 'sauna', label: 'Сауна', icon: 'fa-hot-tub' },
        { name: 'spa', label: 'SPA', icon: 'fa-spa' },
        { name: 'fitness', label: 'Тренажёрный зал', icon: 'fa-dumbbell' },
        { name: 'beach', label: 'Собственный пляж', icon: 'fa-umbrella-beach' },
        { name: 'waterpark', label: 'Аквапарк', icon: 'fa-water' },
        { name: 'playroom', label: 'Игровая комната', icon: 'fa-gamepad' },
    ];

    const roomItemOptions = [
        { name: 'ac', label: 'Кондиционер', icon: 'fa-wind' },
        { name: 'tv', label: 'Телевизор', icon: 'fa-tv' },
        { name: 'fridge', label: 'Холодильник', icon: 'fa-refrigerator' },
        { name: 'teaCoffee', label: 'Чай/кофе', icon: 'fa-mug-hot' },
        { name: 'safe', label: 'Сейф', icon: 'fa-lock' },
        { name: 'hairdryer', label: 'Фен', icon: 'fa-wind' },
        { name: 'iron', label: 'Утюг', icon: 'fa-tshirt' },
        { name: 'bathroom', label: 'Санузел', icon: 'fa-bath' },
        { name: 'fan', label: 'Вентилятор', icon: 'fa-fan' },
        { name: 'washingMachine', label: 'Стиральная машина', icon: 'fa-soap' },
        { name: 'crib', label: 'Кроватка для детей', icon: 'fa-baby' },
    ];

    const internetOptions = [
        { name: 'wifiFreeRoom', label: 'Бесплатный Wi-Fi в номере' },
        { name: 'wifiPaidRoom', label: 'Платный Wi-Fi в номере' },
        { name: 'wifiFreeArea', label: 'Бесплатный Wi-Fi на территории' },
        { name: 'wifiPaidArea', label: 'Платный Wi-Fi на территории' },
    ];

    const parkingOptions = [
        { name: 'parkingFree', label: 'Бесплатная парковка' },
        { name: 'parkingPaid', label: 'Платная парковка' },
        { name: 'parkingDisabled', label: 'Парковка для людей с инвалидностью' },
    ];

    const mealOptions = [
        { name: 'restaurantBar', label: 'Ресторан/бар' },
        { name: 'fullBoard', label: 'Полный пансион' },
        { name: 'halfBoard', label: 'Полупансион' },
        { name: 'breakfast', label: 'Завтрак' },
        { name: 'buffet', label: 'Шведский стол' },
    ];

    const cleaningOptions = [
        { name: 'dailyCleaning', label: 'Ежедневная уборка' },
        { name: 'weeklyCleaning', label: 'Еженедельная уборка' },
    ];

    const paymentOptions = [
        { name: 'cash', label: 'Наличными' },
        { name: 'card', label: 'Картой' },
        { name: 'sbp', label: 'СБП' },
    ];

    return (
        <aside className="filters-sidebar">
            <SortToggleGroup value={filters.sort} onChange={handleSortChange} />

            <PriceRangeSlider
                min={filters.price.min}
                max={filters.price.max}
                minLimit={500}
                maxLimit={50000}
                onMinChange={handlePriceMinChange}
                onMaxChange={handlePriceMaxChange}
            />

            <div className="filter-section">
                <h3>Тип кровати</h3>
                <RadioGroup
                    name="bed-type"
                    options={bedTypeOptions}
                    value={filters.bedType}
                    onChange={handleBedTypeChange}
                />
            </div>

            <div className="filter-section">
                <h3>Особенности размещения</h3>
                <div className="checkbox-group">
                    <label className="checkbox-label">
                        <input
                            type="checkbox"
                            checked={filters.petsAllowed}
                            onChange={() => handleSimpleToggle('petsAllowed')}
                        />
                        <span>Можно с животными</span>
                    </label>
                    <label className="checkbox-label">
                        <input
                            type="checkbox"
                            checked={filters.familyFriendly}
                            onChange={() => handleSimpleToggle('familyFriendly')}
                        />
                        <span>Для всей семьи</span>
                    </label>
                </div>
            </div>

            <div className="filter-section">
                <h3>Занятия в отеле</h3>
                <CheckboxWithIconGroup
                    options={activityOptions}
                    values={filters.activities}
                    onChange={handleActivityChange}
                />
            </div>

            <div className="filter-section">
                <h3>Удобства в номере</h3>
                <div className="amenity-category">
                    <h4>Интернет</h4>
                    <CheckboxGroup
                        options={internetOptions}
                        values={filters.amenities}
                        onChange={handleAmenityChange}
                    />
                </div>
                <div className="amenity-category">
                    <h4>Парковка</h4>
                    <CheckboxGroup
                        options={parkingOptions}
                        values={filters.amenities}
                        onChange={handleAmenityChange}
                    />
                </div>
                <div className="amenity-category">
                    <h4>Вещи в номере</h4>
                    <CheckboxWithIconGroup
                        options={roomItemOptions}
                        values={filters.amenities}
                        onChange={handleAmenityChange}
                    />
                </div>
                <div className="amenity-category">
                    <h4>Питание</h4>
                    <CheckboxGroup
                        options={mealOptions}
                        values={filters.amenities}
                        onChange={handleAmenityChange}
                    />
                </div>
                <div className="amenity-category">
                    <h4>Уборка</h4>
                    <CheckboxGroup
                        options={cleaningOptions}
                        values={filters.amenities}
                        onChange={handleAmenityChange}
                    />
                </div>
                <div className="amenity-category">
                    <h4>Оплата</h4>
                    <CheckboxGroup
                        options={paymentOptions}
                        values={filters.amenities}
                        onChange={handleAmenityChange}
                    />
                </div>
            </div>

            <button className="apply-filters-btn" onClick={handleApply}>
                Применить фильтры
            </button>
            <button className="reset-filters-btn" onClick={handleReset}>
                Сбросить все
            </button>
        </aside>
    );
};

export default Filters;