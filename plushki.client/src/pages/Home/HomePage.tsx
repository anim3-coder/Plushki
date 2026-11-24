import React, { useEffect, useCallback, useMemo, useRef, useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import '../../styles/components/search-form.css';
import Filters from './Filters/Filters.tsx';
import { type Hotel } from './Result/HotelCard.tsx';
import Results from './Result/Results.tsx';


const HomePage: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const CITIES = [
        "Москва", "Санкт-Петербург", "Новосибирск", "Екатеринбург", "Казань",
        "Нижний Новгород", "Челябинск", "Самара", "Омск", "Ростов-на-Дону",
        "Уфа", "Красноярск", "Воронеж", "Пермь", "Волгоград",
        "Краснодар", "Саратов", "Тюмень", "Тольятти", "Ижевск",
        "Барнаул", "Ульяновск", "Иркутск", "Хабаровск", "Ярославль",
        "Владивосток", "Махачкала", "Томск", "Оренбург", "Кемерово",
        "Новокузнецк", "Рязань", "Астрахань", "Набережные Челны", "Пенза",
        "Липецк", "Киров", "Чебоксары", "Калининград", "Тула",
        "Улан-Удэ", "Ставрополь", "Курск", "Магнитогорск", "Брянск",
        "Иваново", "Тверь", "Сочи", "Белгород", "Нижний Тагил",
        "Архангельск", "Владимир", "Калуга", "Сургут", "Чита",
        "Грозный", "Якутск", "Мурманск", "Вологда", "Петрозаводск",
        "Саранск", "Тамбов", "Череповец", "Нижневартовск", "Кострома",
        "Орск", "Стерлитамак", "Ангарск", "Йошкар-Ола", "Новороссийск",
        "Комсомольск-на-Амуре", "Таганрог", "Братск", "Дзержинск", "Шахты",
        "Нижнекамск", "Благовещенск", "Химки", "Королёв", "Подольск",
        "Энгельс", "Сыктывкар", "Новочеркасск", "Псков", "Балаково",
        "Бийск", "Прокопьевск", "Армавир", "Люберцы", "Абакан",
        "Норильск", "Рубцовск", "Мытищи", "Салават", "Майкоп",
        "Уссурийск", "Кызыл", "Элиста", "Нальчик", "Крым",
    ];

    const MAX_SUGGESTIONS = 8;

    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const today = `${year}-${month}-${day}`;

    const showHero = !location.pathname.startsWith('/search');
    const routeState = location.state as {
        destination?: string;
        checkIn?: string;
        checkOut?: string;
        guests?: { adults: number; children: number };
    } || {};

    const [destination, setDestination] = useState(() => routeState.destination || '');
    const [checkIn, setCheckIn] = useState(() => routeState.checkIn || '');
    const [checkOut, setCheckOut] = useState(() => routeState.checkOut || '');
    const [adults, setAdults] = useState(() => routeState.guests?.adults ?? 2);
    const [children, setChildren] = useState(() => routeState.guests?.children ?? 0);
    const [hotels, setHotels] = useState<Hotel[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [totalPage, setTotalPage] = useState(0);
    const [filterParams, setFilterParams] = useState<string[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);
    const blurTimeout = useRef<number | null>(null);

    const suggestions = useMemo(() => {
        const q = destination.trim().toLowerCase();
        if (!q) return [];
        return CITIES
            .filter((c) => c.toLowerCase().includes(q))
            .slice(0, MAX_SUGGESTIONS);
    }, [destination]);

    const selectCity = (city: string) => {
        setDestination(city);
        setShowSuggestions(false);
        setActiveIndex(-1);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (!showSuggestions) {
                setShowSuggestions(true);
                return;
            }
            if (suggestions.length === 0) return;
            setActiveIndex((i) => (i + 1) % suggestions.length);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (suggestions.length === 0) return;
            setActiveIndex((i) => (i - 1 + suggestions.length) % suggestions.length);
        } else if (e.key === 'Enter') {
            if (showSuggestions && activeIndex >= 0 && activeIndex < suggestions.length) {
                e.preventDefault();
                selectCity(suggestions[activeIndex]);
            }
        } else if (e.key === 'Escape') {
            setShowSuggestions(false);
            setActiveIndex(-1);
        }
    };

    const handleFocus = () => {
        if (blurTimeout.current) {
            clearTimeout(blurTimeout.current);
            blurTimeout.current = null;
        }
        if (destination.trim()) setShowSuggestions(true);
    };

    const handleBlur = () => {
        // небольшая задержка, чтобы клик по пункту успел сработать
        blurTimeout.current = window.setTimeout(() => {
            setShowSuggestions(false);
            setActiveIndex(-1);
        }, 150);
    };

    const setFetchHotels = useCallback(async (): Promise<void> => { fetchHotels(destination) }, [page]);

    const setFHFromFilters = useCallback(async (): Promise<void> => { fetchHotels(destination) }, [filterParams]);

    const parsePriceRange = (
        params: string[]
    ): { min: number | null; max: number | null } => {
        let min: number | null = null;
        let max: number | null = null;

        for (const p of params) {
            const idx = p.indexOf('=');
            if (idx <= 0) continue;

            const key = p.slice(0, idx);
            const raw = p.slice(idx + 1);
            const num = Number(raw);

            if (!Number.isFinite(num)) continue;

            if (key === 'price_min') min = num;
            else if (key === 'price_max') max = num;
        }

        return { min, max };
    };

    useEffect(() => { 
        void setFHFromFilters();
    }, [setFHFromFilters])

    useEffect(() => {
        void setFetchHotels();
    }, [setFetchHotels]);

    const fetchHotels = async (city: string) => {
        setLoading(true);
        setError(null);
        try {
            const params = {
                city,
                country: '',
                page,
                pageSize: 10,
                filters: filterParams,
            };

            const hotels = await axios.get('/api/hotels', {
                params,
                paramsSerializer: { indexes: null },
            });

            const { min: priceMin, max: priceMax } = parsePriceRange(filterParams);

            const hotelsWithPrice: Hotel[] = (hotels.data.data || []).map((hotel) => {
                const allRooms = hotel.rooms ?? [];

                // Оставляем только комнаты, чья цена попадает в [priceMin, priceMax]
                const roomsInRange = allRooms.filter((room) => {
                    const p = room.pricePerNight;
                    if (priceMin !== null && p < priceMin) return false;
                    if (priceMax !== null && p > priceMax) return false;
                    return true;
                });

                const minPrice = roomsInRange.length > 0
                    ? Math.min(...roomsInRange.map((r) => r.pricePerNight))
                    : 0;

                return {
                    ...hotel,
                    rooms: roomsInRange,   // отдаём карточке только подходящие комнаты
                    price: minPrice,
                };
            });

            const totalCount = hotels.data.totalCount || 0;
            setHotels(hotelsWithPrice);
            setTotalCount(totalCount);
            setTotalPage(Math.ceil(totalCount / 10));
        } catch (error) {
            console.error('Ошибка при загрузке отелей:', error);
            setError('Не удалось загрузить отели. Попробуйте позже.');
            setHotels([]);
            setTotalCount(0);
        } finally {
            setLoading(false);
        }
    };

    const Search = () => {
        fetchHotels(destination);
    };

    useEffect(() => {
        if (destination) {
            Search();
        }
    }, [location.key]);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const cityParam = params.get('city');

        if (cityParam) {
            setDestination(cityParam);
            fetchHotels(cityParam);
        }
    }, [location.search]);

    const handleDestinationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDestination(e.target.value);
        setShowSuggestions(true);
        setActiveIndex(-1);
    };

    const handleCheckInChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCheckIn(e.target.value);
    };

    const handleCheckOutChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCheckOut(e.target.value);
    };

    // Изменение количества взрослых
    const handleAdultsChange = (delta: number) => {
        setAdults(prev => Math.max(1, prev + delta));
    };

    // Изменение количества детей
    const handleChildrenChange = (delta: number) => {
        setChildren(prev => Math.max(0, prev + delta));
    };

    // Обработчик отправки формы (переход на страницу поиска)
    const handleSearch = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        // Простейшая валидация
        if (!destination.trim()) {
            alert('Пожалуйста, укажите направление');
            return;
        }
        if (!checkIn || !checkOut) {
            alert('Пожалуйста, выберите даты заезда и выезда');
            return;
        }

        const searchData = {
            destination: destination.trim(),
            checkIn,
            checkOut,
            guests: {
                adults,
                children,
            },
        };

        Search();
        navigate('/search', { state: searchData });
    };

    const openHotel = (id: number) => {
        navigate("hotel/" + id, {
            state: {
                destination,
                checkIn,
                checkOut,
                guests: { adults, children },
                id,
            },
        })
    };

    return (
        <main className="container">
            {showHero && (
                <section className="hero">
                    <div className="container">
                        <div className="hero-content">
                            <h1>Найдите идеальный отель для вашего путешествия</h1>
                            <p>Сравните цены на отели по сотням сайтов бронирования</p>
                        </div>
                    </div>
                </section>
            )}

            <div className="search-form">
                <form id="main-search-form">
                    <div className="search-form-row">
                        <div className="form-group">
                            <label htmlFor="destination">Куда</label>
                            <input
                                type="text"
                                id="destination"
                                placeholder="Город"
                                value={destination}
                                onChange={handleDestinationChange}
                                onKeyDown={handleKeyDown}
                                onFocus={handleFocus}
                                onBlur={handleBlur}
                                autoComplete="off"
                                required
                            />

                            {showSuggestions && suggestions.length > 0 && (
                                <div
                                    className="autocomplete-container"
                                    style={{ display: 'block' }}   // переопределяем display: none из CSS
                                    id="autocomplete-container"
                                >
                                    {suggestions.map((city, index) => (
                                        <div
                                            key={city}
                                            className="autocomplete-item"
                                            style={index === activeIndex ? { backgroundColor: '#f0f0f0' } : undefined}
                                            onMouseDown={(e) => e.preventDefault()}  // не даём input потерять фокус до клика
                                            onClick={() => selectCity(city)}
                                        >
                                            {city}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className="form-group">
                            <label htmlFor="check-in">Заезд</label>
                            <input
                                type="date"
                                id="check-in"
                                value={checkIn}
                                onChange={handleCheckInChange}
                                min={today || undefined}
                                max={checkOut || undefined}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="check-out">Выезд</label>
                            <input
                                type="date"
                                id="check-out"
                                value={checkOut}
                                onChange={handleCheckOutChange}
                                min={checkIn || today || undefined}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <div className="guests-selector-wrapper">
                                <div className="guest-type">
                                    <span>Взрослые</span>
                                    <div className="guests-selector">
                                        <button
                                            type="button"
                                            className="guest-btn minus"
                                            onClick={() => handleAdultsChange(-1)}
                                            disabled={adults <= 1}
                                        >
                                            -
                                        </button>
                                        <input
                                            type="text"
                                            className="guest-count"
                                            value={adults}
                                            readOnly
                                        />
                                        <button
                                            type="button"
                                            className="guest-btn plus"
                                            onClick={() => handleAdultsChange(1)}
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                                <div className="guest-type">
                                    <span>Дети</span>
                                    <div className="guests-selector">
                                        <button
                                            type="button"
                                            className="guest-btn minus"
                                            onClick={() => handleChildrenChange(-1)}
                                            disabled={children <= 0}
                                        >
                                            -
                                        </button>
                                        <input
                                            type="text"
                                            className="guest-count"
                                            value={children}
                                            readOnly
                                        />
                                        <button
                                            type="button"
                                            className="guest-btn plus"
                                            onClick={() => handleChildrenChange(1)}
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <input
                                type="hidden"
                                id="guests"
                                name="guests"
                                value={`${adults} взрослых, ${children} детей`}
                            />
                        </div>
                        <div className="form-group">
                            <button
                                type="button"
                                className="search-btn"
                                onClick={handleSearch}
                            >
                                Найти отели
                            </button>
                        </div>
                    </div>
                </form>
            </div>

            {!showHero && (
                <div>
                    <div className="search-header">
                    </div>
                    <div className="search-content">
                        <Filters onParamsChange={setFilterParams} />
                        <Results
                            hotels={hotels}
                            totalCount={totalCount}
                            loading={loading}
                            error={error}
                            destination={destination}
                            checkOut={checkOut}
                            checkIn={checkIn}
                            openHotel={openHotel}
                            page={page}
                            totalPages={totalPage}
                            setPage={setPage}
                        />
                    </div>
                </div>
            )}
        </main>
    );
};

export default HomePage;