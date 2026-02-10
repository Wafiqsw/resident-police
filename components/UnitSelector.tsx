'use client';

import React, { useEffect, useState } from 'react';
import { BLOCKS, FLOORS, BlockType, FloorType, UNITS_PER_FLOOR, formatUnitId, isUnitOccupied } from '@/constants/residential';
import { getOccupiedUnits } from '@/lib/firestore';
import { HouseDetails } from '@/types';

interface UnitSelectorProps {
    houseNumber: HouseDetails;
    onChange: (data: HouseDetails) => void;
    required?: boolean;
    disabled?: boolean;
    className?: string;
    initialHouseNumber?: string; // The house ID string that the user CURRENTLY occupies
}

const UnitSelector: React.FC<UnitSelectorProps> = ({
    houseNumber: currentHouse,
    onChange,
    required = false,
    disabled = false,
    className = "",
    initialHouseNumber,
}) => {
    const [occupiedUnits, setOccupiedUnits] = useState<string[]>([]);

    useEffect(() => {
        const fetchOccupied = async () => {
            try {
                const units = await getOccupiedUnits();
                console.log('Occupied Units fetched:', units);
                setOccupiedUnits(units);
            } catch (error) {
                console.error("Error fetching occupied units:", error);
            }
        };
        fetchOccupied();
    }, [initialHouseNumber]); // Refresh if initial ID changes

    const { block = '', floor = '', houseNo = '' } = currentHouse || {};

    const handleBlockChange = (newBlock: string) => {
        onChange({ block: newBlock, floor: '', houseNo: '' });
    };

    const handleFloorChange = (newFloor: string) => {
        if (!block) return;

        // Find the first available unit on this floor
        let foundUnit = '';
        for (let i = 1; i <= UNITS_PER_FLOOR; i++) {
            const unitNo = i.toString().padStart(2, '0');
            const isOccupied = isUnitOccupied(block, newFloor, unitNo, occupiedUnits, initialHouseNumber);

            if (!isOccupied) {
                foundUnit = unitNo;
                break;
            }
        }

        // If floor is full, we still set the floor but clear the unit so they must pick another floor
        onChange({ block, floor: newFloor, houseNo: foundUnit });
    };

    const handleUnitChange = (newUnit: string) => {
        if (!block || !floor) return;

        if (isUnitOccupied(block, floor, newUnit, occupiedUnits, initialHouseNumber)) {
            alert('This unit is already occupied. Please select another unit.');
            return;
        }

        onChange({ block, floor, houseNo: newUnit });
    };

    return (
        <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 ${className}`}>
            {/* Block Select */}
            <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                    Block {required && <span className="text-red-500">*</span>}
                </label>
                <div className="relative">
                    <select
                        value={block}
                        onChange={(e) => handleBlockChange(e.target.value)}
                        disabled={disabled}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all appearance-none cursor-pointer text-sm disabled:opacity-50"
                    >
                        <option value="" disabled>Select Block</option>
                        {BLOCKS.map((b) => (
                            <option key={b} value={b}>{b}</option>
                        ))}
                    </select>
                    <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-400">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Floor Select */}
            <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                    Floor {required && <span className="text-red-500">*</span>}
                </label>
                <div className="relative">
                    <select
                        value={floor}
                        onChange={(e) => handleFloorChange(e.target.value)}
                        disabled={disabled || !block}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all appearance-none cursor-pointer text-sm disabled:opacity-50"
                    >
                        <option value="" disabled>{block ? 'Select Floor' : 'Pick Block First'}</option>
                        {FLOORS.map((f) => (
                            <option key={f} value={f}>Level {f}</option>
                        ))}
                    </select>
                    <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-400">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Unit/Room Select */}
            <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                    Unit/Room {required && <span className="text-red-500">*</span>}
                </label>
                <div className="relative">
                    <select
                        value={houseNo}
                        onChange={(e) => handleUnitChange(e.target.value)}
                        disabled={disabled || !floor}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all appearance-none cursor-pointer text-sm disabled:opacity-50"
                    >
                        <option value="" disabled>{floor ? 'Select Unit' : 'Pick Floor First'}</option>
                        {Array.from({ length: UNITS_PER_FLOOR }, (_, i) => {
                            const unitNo = (i + 1).toString().padStart(2, '0');
                            const isOccupied = isUnitOccupied(block, floor, unitNo, occupiedUnits, initialHouseNumber);

                            return (
                                <option
                                    key={unitNo}
                                    value={unitNo}
                                    disabled={isOccupied}
                                    className={isOccupied ? 'text-gray-400 bg-gray-100' : ''}
                                >
                                    Unit {unitNo} {isOccupied ? '(Occupied)' : ''}
                                </option>
                            );
                        })}
                    </select>
                    <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-400">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UnitSelector;
