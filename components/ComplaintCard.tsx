'use client';

import React from 'react';
import { Complaint } from '@/types';

interface ComplaintCardProps {
    complaint: Complaint;
    onEvaluate: (id: string) => void;
    onResolve?: (id: string) => void;
    onView: (id: string) => void;
}

const ComplaintCard: React.FC<ComplaintCardProps> = ({ complaint, onEvaluate, onResolve, onView }) => {
    return (
        <tr className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
            <td className="px-4 py-4 text-sm font-medium text-gray-900">{complaint.id}</td>
            <td className="px-4 py-4 text-sm text-gray-700">{complaint.creator.fullName}</td>
            <td className="px-4 py-4 text-sm text-gray-700">{complaint.creator.houseNumber.block}</td>
            <td className="px-4 py-4 text-sm text-gray-700">{complaint.issue}</td>
            {complaint.status !== 'pending' && (
                <td className="px-4 py-4">
                    <span
                        className={`px-3 py-1 text-xs font-medium rounded-full ${complaint.status === 'accepted'
                            ? 'bg-blue-100 text-blue-700'
                            : complaint.status === 'resolved'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-red-100 text-red-700'
                            }`}
                    >
                        {complaint.status === 'accepted' ? 'Accepted' : complaint.status === 'resolved' ? 'Resolved' : 'Rejected'}
                    </span>
                </td>
            )}
            <td className="px-4 py-4">
                {complaint.status === 'pending' ? (
                    <button
                        onClick={() => onEvaluate(complaint.id)}
                        className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium text-sm"
                    >
                        Evaluate
                    </button>
                ) : complaint.status === 'accepted' ? (
                    <button
                        onClick={() => onResolve && onResolve(complaint.id)}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-sm"
                    >
                        Resolve
                    </button>
                ) : (
                    <button
                        onClick={() => onView(complaint.id)}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium text-sm"
                    >
                        View
                    </button>
                )}
            </td>
        </tr>
    );
};

export default ComplaintCard;
