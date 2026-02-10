'use client';

import React from 'react';
import { RESIDENTIAL_DATA, BlockType } from '@/constants/residential';

interface HouseSelectProps {
    label?: string;
    block: string;
    value: string;
    onChange: (value: string) => void;
    required?: boolean;
    disabled?: boolean;
    className?: string;
}

const HouseSelect: React.FC<HouseSelectProps> = ({
    label = 'House Number',
    block,
    value,
    onChange,
    required = false,
    disabled = false,
    className = "",
}) => {
    const houses = block && RESIDENTIAL_DATA[block as BlockType] ? RESIDENTIAL_DATA[block as BlockType] : [];

    return (
        <div className={className}>
            {label && (
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
            )}
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                disabled={disabled || !block}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all appearance-none cursor-pointer text-sm disabled:opacity-50"
            >
                <option value="">{block ? 'Select house number' : 'Select block first'}</option>
                {houses.map((house) => (
                    <option key={house} value={house}>
                        {house}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default HouseSelect;
