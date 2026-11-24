import '../../styles/hotel-page.css';

interface GuestSelectorProps {
    label: string;
    value: number;
    min?: number;
    max?: number;
    onChange: (newValue: number) => void;
}

const GuestSelector: React.FC<GuestSelectorProps> = ({
    label,
    value,
    min = 0,
    max = 10,
    onChange
}) => {
    const handleDecrement = () => {
        if (value > min) onChange(value - 1);
    };

    const handleIncrement = () => {
        if (value < max) onChange(value + 1);
    };

    return (
        <div className="guest-type">
            <span>{label}</span>
            <div className="guests-selector">
                <button type="button" className="guest-btn minus" onClick={handleDecrement}>-</button>
                <input type="text" className="guest-count" value={value} readOnly />
                <button type="button" className="guest-btn plus" onClick={handleIncrement}>+</button>
            </div>
        </div>
    );
};

export default GuestSelector;