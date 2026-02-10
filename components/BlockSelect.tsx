'use client';

import React from 'react';
import { BLOCKS } from '@/constants/residential';

interface BlockSelectProps {
    label?: string;
    value: string;
    onChange: (value: string) => void;
    required?: boolean;
    disabled?: boolean;
    className?: string;
}


const BlockSelect: React.FC<BlockSelectProps> = ({
    label = 'Block',
    value,
    onChange,
    required = false,
    disabled = false,
    className = "",
}) => {
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
                disabled={disabled}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all appearance-none cursor-pointer text-sm"
            >
                <option value="" disabled>Select a block</option>
                {BLOCKS.map((block) => (
                    <option key={block} value={block}>
                        {block}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default BlockSelect;
