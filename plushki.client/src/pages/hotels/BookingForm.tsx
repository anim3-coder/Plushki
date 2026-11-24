import '../../styles/hotel-page.css';
import GuestSelector from './GuestSelector';

interface BookingFormProps {
    checkIn: string;
    checkOut: string;
    adults: number;
    children: number;
    basePrice: number;
    onCheckInChange: (date: string) => void;
    onCheckOutChange: (date: string) => void;
    onAdultsChange: (count: number) => void;
    onChildrenChange: (count: number) => void;
}

const BookingForm: React.FC<BookingFormProps> = ({
    checkIn,
    checkOut,
    adults,
    children,
    basePrice,
    onCheckInChange,
    onCheckOutChange,
    onAdultsChange,
    onChildrenChange
}) => {

    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const today = `${year}-${month}-${day}`;

    return (
        <div className="booking-form-container">
            <div className="booking-form">
                <h3>Забронировать номер</h3>
                <form>
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="hotel-check-in">Заезд</label>
                            <input
                                type="date"
                                id="hotel-check-in"
                                value={checkIn}
                                onChange={(e) => onCheckInChange(e.target.value)}
                                min={today || undefined}
                                max={checkOut || undefined}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="hotel-check-out">Выезд</label>
                            <input
                                type="date"
                                id="hotel-check-out"
                                value={checkOut}
                                onChange={(e) => onCheckOutChange(e.target.value)}
                                min={checkIn || today || undefined}
                                required
                            />
                        </div>
                        <GuestSelector
                            label="Взрослые"
                            value={adults}
                            min={1}
                            onChange={onAdultsChange}
                        />
                        <GuestSelector
                            label="Дети"
                            value={children}
                            onChange={onChildrenChange}
                        />
                    </div>
                </form>
            </div>
            <div className="booking-summary">
                <div className="price-info">
                    <span className="price">от {basePrice.toLocaleString()} ₽</span>
                    <span className="price-desc">за ночь</span>
                </div>
                <div className="includes">Включено: налоги, сборы</div>
            </div>
        </div>
    );
};

export default BookingForm;