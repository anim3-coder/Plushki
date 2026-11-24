import React from 'react';
import '../../../styles/components/search-form.css';
import '../../../styles/components/hotels-grid.css';
import '../../../styles/search.css';

interface CheckboxGroupProps {
    options: { name: string; label: string }[];
    values: Record<string, boolean>;
    onChange: (name: string, checked: boolean) => void;
}

const CheckboxGroup: React.FC<CheckboxGroupProps> = ({ options, values, onChange }) => (
    <div className="checkbox-group">
        {options.map((opt) => (
            <label key={opt.name} className="checkbox-label">
                <input
                    type="checkbox"
                    name={opt.name}
                    checked={values[opt.name] || false}
                    onChange={(e) => onChange(opt.name, e.target.checked)}
                />
                <span>{opt.label}</span>
            </label>
        ))}
    </div>
);

export default CheckboxGroup;
