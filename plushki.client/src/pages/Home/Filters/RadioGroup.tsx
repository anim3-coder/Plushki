import React from 'react';
import '../../../styles/components/search-form.css';
import '../../../styles/components/hotels-grid.css';
import '../../../styles/search.css';

export interface RadioGroupProps {
    name: string;
    options: { value: string; label: string }[];
    value: string;
    onChange: (value: string) => void;
}

const RadioGroup: React.FC<RadioGroupProps> = ({ name, options, value, onChange }) => (
    <div className="radio-group">
        {options.map((opt) => (
            <label key={opt.value} className="radio-label">
                <input
                    type="radio"
                    name={name}
                    value={opt.value}
                    checked={value === opt.value}
                    onChange={() => onChange(opt.value)}
                />
                <span>{opt.label}</span>
            </label>
        ))}
    </div>
);


export default RadioGroup;