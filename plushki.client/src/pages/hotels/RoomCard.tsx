import '../../styles/hotel-page.css';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface RoomCardProps {
    name: string;
    imagesURL: string[];
    bedType: string;
    square: number;
    additionalServices: string[];
    pricePerNight: number;
    onSelect: () => void;
}

export const MAX_AMENITIES = 6;

const AMENITY_ICONS: Record<string, string> = {
    'wi-fiвномере': 'fa-wifi',
    'бесплатныйwi-fiвномере': 'fa-wifi',
    'платныйwi-fiвномере': 'fa-wifi',
    'бесплатныйwi-fiнавсейтерритории': 'fa-wifi',
    'платныйwi-fiнавсейтерритории': 'fa-wifi',
    'кондиционер': 'fa-wind',
    'телевизор': 'fa-tv',
    'холодильник': 'fa-snowflake',
    'чай/кофе': 'fa-mug-hot',
    'сейф': 'fa-lock',
    'фен': 'fa-wind',
    'утюг': 'fa-tshirt',
    'санузел': 'fa-bath',
    'ванная': 'fa-bath',
    'душ': 'fa-shower',
    'вентилятор': 'fa-fan',
    'стиральнаямашина': 'fa-soap',
    'кроваткадлядетей': 'fa-baby',
    'кухня': 'fa-utensils',
    'балкон': 'fa-door-open',
};

const normalize = (s: string) => s.toLowerCase().replace(/\s+/g, '');

/** "Двуспальная кровать:2", "Спальня:1" — это не удобства, а модификаторы */
const isCountEntry = (s: string) => /^[^:]+:\d+$/.test(s.trim());

const getAmenityIcon = (amenity: string): string | null =>
    AMENITY_ICONS[normalize(amenity)] ?? null;

/** Оставляет только «настоящие» удобства, отбрасывает "Имя:Кол-во" */
const pureAmenities = (list: string[] | undefined): string[] =>
    (list ?? []).filter((a) => a && !isCountEntry(a));

const FALLBACK_IMAGE =
    'https://via.placeholder.com/400x300?text=No+image';

const RoomCard: React.FC<RoomCardProps> = ({
    name,
    imagesURL = [],
    bedType,
    square,
    additionalServices = [],
    pricePerNight = 0,
    onSelect,
}) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [expanded, setExpanded] = useState(false);

    // Защита от пустого массива картинок
    const images = imagesURL.length > 0 ? imagesURL : [FALLBACK_IMAGE];
    const safeIndex = Math.min(currentIndex, images.length - 1);

    const goPrev = () =>
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    const goNext = () =>
        setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));

    const cleanAmenities = pureAmenities(additionalServices);

    const visible = expanded
        ? cleanAmenities
        : cleanAmenities.slice(0, MAX_AMENITIES);
    const hiddenCount = cleanAmenities.length - visible.length;

    return (
        <div className="room-card">
            <div
                className="room-gallery"
                style={{ position: 'relative', overflow: 'hidden' }}
            >
                <AnimatePresence mode="wait">
                    <motion.img
                        key={safeIndex}
                        src={images[safeIndex]}
                        alt={name}
                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        transition={{ duration: 0.3 }}
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                        }}
                    />
                </AnimatePresence>

                {images.length > 1 && (
                    <div className="image-nav">
                        <div className="nav-btn" onClick={goPrev}>
                            <i className="fas fa-chevron-left" />
                        </div>
                        <div className="nav-btn" onClick={goNext}>
                            <i className="fas fa-chevron-right" />
                        </div>
                    </div>
                )}

                {/* Индикатор «2/5» */}
                {images.length > 1 && (
                    <div className="image-counter">
                        {safeIndex + 1} / {images.length}
                    </div>
                )}
            </div>

            <div className="room-info">
                <h3 className="room-name">{name}</h3>

                <div className="room-details">
                    <div className="room-detail">
                        <i className="fas fa-bed" /> <span>{bedType}</span>
                    </div>
                    <div className="room-detail">
                        <i className="fas fa-expand" />
                        <span>{square} м²</span>
                    </div>
                </div>

                {cleanAmenities.length > 0 && (
                    <div className="room-details">
                        {visible.map((item, idx) => {
                            const icon = getAmenityIcon(item);
                            return (
                                <span key={`${item}-${idx}`} className="room-detail">
                                    {icon && <i className={`fas ${icon}`} />}
                                    {item}
                                </span>
                            );
                        })}

                        {hiddenCount > 0 && (
                            <span
                                className="amenity-tag amenity-more"
                                role="button"
                                tabIndex={0}
                                title={cleanAmenities
                                    .slice(MAX_AMENITIES)
                                    .join(', ')}
                                onClick={() => setExpanded(true)}
                                onKeyDown={(e) =>
                                    e.key === 'Enter' && setExpanded(true)
                                }
                            >
                                +{hiddenCount}
                            </span>
                        )}

                        {expanded && cleanAmenities.length > MAX_AMENITIES && (
                            <span
                                className="amenity-tag amenity-more"
                                role="button"
                                tabIndex={0}
                                onClick={() => setExpanded(false)}
                                onKeyDown={(e) =>
                                    e.key === 'Enter' && setExpanded(false)
                                }
                            >
                                свернуть
                            </span>
                        )}
                    </div>
                )}

                <div className="room-price">
                    <div className="room-detail">
                        <div className="price">
                            {pricePerNight.toLocaleString('ru-RU')} ₽
                        </div>
                        <div className="price-desc">
                            за 1 ночь в одном номере
                        </div>
                    </div>
                    <button className="select-btn" onClick={onSelect}>
                        Выбрать
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RoomCard;