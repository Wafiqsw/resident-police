'use client';

import React from 'react';
import { Announcement } from '@/types';

interface AnnouncementCardProps {
    announcement: Announcement;
    onView: (id: string) => void;
}

const AnnouncementCard: React.FC<AnnouncementCardProps> = ({ announcement, onView }) => {
    const isExpired = announcement.expirationDate
        ? new Date(announcement.expirationDate) < new Date()
        : false;

    return (
        <div
            onClick={() => onView(announcement.id)}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all cursor-pointer group"
        >
            <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                        {announcement.title}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                        Posted by {announcement.createdBy.email} • {new Date(announcement.createdAt).toLocaleDateString()}
                    </p>
                </div>
                {isExpired && (
                    <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">
                        Expired
                    </span>
                )}
                {!isExpired && announcement.expirationDate && (
                    <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                        Active
                    </span>
                )}
            </div>

            <p className="text-gray-600 line-clamp-2 mb-4">
                {announcement.details}
            </p>

            {/* Image or Placeholder */}
            <div className="mb-4 rounded-lg overflow-hidden bg-gray-100">
                {announcement.image ? (
                    <img
                        src={announcement.image}
                        alt={announcement.title}
                        className="w-full h-48 object-cover"
                    />
                ) : (
                    <div className="w-full h-48 flex items-center justify-center">
                        <svg className="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                )}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                {announcement.expirationDate && (
                    <div className="text-sm text-gray-500">
                        <span className="font-medium">Expires:</span> {new Date(announcement.expirationDate).toLocaleDateString()}
                    </div>
                )}
                <button className="text-indigo-600 hover:text-indigo-700 font-medium text-sm flex items-center gap-1">
                    View Details
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default AnnouncementCard;
