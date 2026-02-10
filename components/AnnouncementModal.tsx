'use client';

import React, { useState, useEffect } from 'react';
import { Announcement } from '@/types';

interface AnnouncementModalProps {
    isOpen: boolean;
    onClose: () => void;
    announcement?: Announcement | null;
    onSave: (announcement: Omit<Announcement, 'id' | 'createdAt' | 'createdBy'>) => Promise<void> | void;
}

const AnnouncementModal: React.FC<AnnouncementModalProps> = ({
    isOpen,
    onClose,
    announcement,
    onSave,
}) => {
    const [title, setTitle] = useState('');
    const [details, setDetails] = useState('');
    const [image, setImage] = useState('');
    const [expirationDate, setExpirationDate] = useState('');
    const [showPreview, setShowPreview] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (announcement) {
            setTitle(announcement.title);
            setDetails(announcement.details);
            setImage(announcement.image || '');
            setExpirationDate(announcement.expirationDate || '');
        } else {
            setTitle('');
            setDetails('');
            setImage('');
            setExpirationDate('');
        }
    }, [announcement, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await onSave({
                title,
                details,
                image: image || undefined,
                expirationDate: expirationDate || undefined,
            });
            onClose();
        } catch (error) {
            // Error managed by parent
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-white">
                        {announcement ? 'Edit Announcement' : 'Add New Announcement'}
                    </h2>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setShowPreview(!showPreview)}
                            className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors text-sm font-medium"
                        >
                            {showPreview ? 'Edit' : 'Preview'}
                        </button>
                        <button
                            onClick={onClose}
                            className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Content */}
                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
                    {!showPreview ? (
                        <>
                            {/* Title */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Title <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                                    placeholder="e.g., Water Supply Maintenance"
                                    required
                                />
                            </div>

                            {/* Details */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Details <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    value={details}
                                    onChange={(e) => setDetails(e.target.value)}
                                    rows={6}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none"
                                    placeholder="Scheduled maintenance on 30 Dec 2025. Water supply may be interrupted."
                                    required
                                />
                            </div>

                            {/* Image Upload */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Image
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                                />
                                {image && (
                                    <div className="mt-3 rounded-lg overflow-hidden">
                                        <img src={image} alt="Preview" className="w-full h-48 object-cover" />
                                    </div>
                                )}
                            </div>

                            {/* Expiration Date */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Expiration Date (Optional)
                                </label>
                                <input
                                    type="date"
                                    value={expirationDate}
                                    onChange={(e) => setExpirationDate(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Leave empty for announcements without expiration
                                </p>
                            </div>
                        </>
                    ) : (
                        /* Preview */
                        <div className="bg-gray-50 rounded-xl p-6">
                            <h3 className="text-sm font-semibold text-gray-500 mb-4">PREVIEW</h3>
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <h3 className="text-xl font-bold text-gray-900 mb-2">{title || 'Untitled'}</h3>
                                <p className="text-sm text-gray-500 mb-4">Posted by Admin • {new Date().toLocaleDateString()}</p>
                                <p className="text-gray-700 whitespace-pre-wrap mb-4">{details || 'No details provided'}</p>
                                {image && (
                                    <div className="mb-4 rounded-lg overflow-hidden">
                                        <img src={image} alt="Preview" className="w-full h-64 object-cover" />
                                    </div>
                                )}
                                {expirationDate && (
                                    <div className="text-sm text-gray-600 pt-4 border-t border-gray-200">
                                        <span className="font-medium">Expires:</span> {new Date(expirationDate).toLocaleDateString()}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </form>

                {/* Footer */}
                <div className="border-t border-gray-200 px-6 py-4 flex items-center justify-end gap-3 bg-gray-50">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium disabled:opacity-50 flex items-center gap-2"
                    >
                        {isSubmitting && (
                            <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        )}
                        {announcement ? (isSubmitting ? 'Updating...' : 'Update') : (isSubmitting ? 'Publishing...' : 'Publish')} Announcement
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AnnouncementModal;
