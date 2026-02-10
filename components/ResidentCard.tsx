'use client';

import React from 'react';

export interface ResidentData {
    id: string;
    name: string;
    policeId: string;
    houseNo: string;
    block: string;
}

interface ResidentCardProps {
    resident: ResidentData;
    onViewProfile?: (residentId: string) => void;
}

const ResidentCard: React.FC<ResidentCardProps> = ({ resident, onViewProfile }) => {
    const handleViewProfile = () => {
        if (onViewProfile) {
            onViewProfile(resident.id);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
                <div className="space-y-2">
                    <div>
                        <span className="text-sm font-medium text-gray-600">Name: </span>
                        <span className="text-base font-semibold text-gray-900">{resident.name}</span>
                    </div>
                    <div>
                        <span className="text-sm font-medium text-gray-600">Police ID </span>
                        <span className="text-base text-gray-900">{resident.policeId}</span>
                    </div>
                    <div>
                        <span className="text-sm font-medium text-gray-600">House No: </span>
                        <span className="text-base text-gray-900">{resident.houseNo}</span>
                    </div>
                </div>
                <button
                    onClick={handleViewProfile}
                    className="px-6 py-2.5 bg-indigo-700 text-white rounded-lg hover:bg-indigo-800 transition-colors font-medium text-sm whitespace-nowrap"
                >
                    View Profile
                </button>
            </div>
        </div>
    );
};

export default ResidentCard;
