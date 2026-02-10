'use client';

import React from 'react';
import { Announcement } from '@/types';

interface AnnouncementDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    announcement: Announcement | null;
    onEdit?: (id: string) => void;
    onDelete?: (id: string) => void;
    readOnly?: boolean; // For resident view
}

const AnnouncementDetailModal: React.FC<AnnouncementDetailModalProps> = ({
    isOpen,
    onClose,
    announcement,
    onEdit,
    onDelete,
    readOnly = false,
}) => {
    if (!isOpen || !announcement) return null;

    const isExpired = announcement.expirationDate
        ? new Date(announcement.expirationDate) < new Date()
        : false;

    const handleDelete = () => {
        if (onDelete && confirm('Are you sure you want to delete this announcement?')) {
            onDelete(announcement.id);
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-white">Announcement Details</h2>
                    <button
                        onClick={onClose}
                        className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {/* Status Badge */}
                    <div className="mb-4">
                        {isExpired ? (
                            <span className="px-4 py-2 bg-red-100 text-red-700 text-sm font-medium rounded-full">
                                Expired
                            </span>
                        ) : announcement.expirationDate ? (
                            <span className="px-4 py-2 bg-green-100 text-green-700 text-sm font-medium rounded-full">
                                Active
                            </span>
                        ) : (
                            <span className="px-4 py-2 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
                                No Expiration
                            </span>
                        )}
                    </div>

                    {/* Title */}
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                        {announcement.title}
                    </h3>

                    {/* Meta Info */}
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-6 pb-6 border-b border-gray-200">
                        <div className="flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            <span>{announcement.createdBy.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span>Posted on {new Date(announcement.createdAt).toLocaleDateString()}</span>
                        </div>
                    </div>

                    {/* Image or Placeholder */}
                    <div className="mb-6 rounded-xl overflow-hidden bg-gray-100">
                        {announcement.image ? (
                            <img
                                src={announcement.image}
                                alt={announcement.title}
                                className="w-full h-auto max-h-96 object-cover"
                            />
                        ) : (
                            <div className="w-full h-64 flex items-center justify-center">
                                <div className="text-center">
                                    <svg className="w-20 h-20 text-gray-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <p className="text-gray-400 text-sm">No image</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Details */}
                    <div className="mb-6">
                        <h4 className="text-lg font-semibold text-gray-900 mb-3">Details</h4>
                        <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                            {announcement.details}
                        </p>
                    </div>

                    {/* Expiration Date */}
                    {announcement.expirationDate && (
                        <div className="bg-gray-50 rounded-lg p-4">
                            <div className="flex items-center gap-2 text-gray-700">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="font-medium">Expires on:</span>
                                <span>{new Date(announcement.expirationDate).toLocaleDateString()}</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 flex items-center justify-between">
                    {!readOnly && onDelete && (
                        <button
                            onClick={handleDelete}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Delete
                        </button>
                    )}
                    <div className={`flex items-center gap-3 ${readOnly ? 'w-full justify-end' : 'ml-auto'}`}>
                        <button
                            onClick={onClose}
                            className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium"
                        >
                            Close
                        </button>
                        {!readOnly && onEdit && (
                            <button
                                onClick={() => {
                                    onEdit(announcement.id);
                                    onClose();
                                }}
                                className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium flex items-center gap-2"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                Edit
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnnouncementDetailModal;
