'use client';

import React, { useState } from 'react';
import { Complaint } from '@/types';

interface SubmitComplaintModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (complaint: Partial<Complaint>) => Promise<void> | void;
}

const SubmitComplaintModal: React.FC<SubmitComplaintModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
}) => {
    const [formData, setFormData] = useState({
        issue: '',
        category: 'Water Fixture',
        seriesNumber: '',
        lastUser: '',
        dateBroken: '',
        brokenDetails: '',
        proofPicture: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        if (!formData.issue || !formData.category || !formData.dateBroken || !formData.brokenDetails) {
            alert('Please fill in all required fields');
            return;
        }

        setIsSubmitting(true);
        try {
            await onSubmit({
                ...formData,
            });

            // Reset form
            setFormData({
                issue: '',
                category: 'Water Fixture',
                seriesNumber: '',
                lastUser: '',
                dateBroken: '',
                brokenDetails: '',
                proofPicture: '',
            });

            onClose();
        } catch (error) {
            // Error managed by parent
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="bg-gradient-to-r from-orange-600 to-red-600 px-6 py-4 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-white">Submit New Complaint</h2>
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
                    <div className="space-y-4">
                        {/* Issue */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Issue <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="issue"
                                value={formData.issue}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                                placeholder="e.g., Water leakage, Broken light"
                            />
                        </div>

                        {/* Category */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Category <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                            >
                                <option value="Water Fixture">Water Fixture</option>
                                <option value="Electrical">Electrical</option>
                                <option value="Plumbing">Plumbing</option>
                                <option value="Structure">Structure</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        {/* Series Number */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Series Number
                            </label>
                            <input
                                type="text"
                                name="seriesNumber"
                                value={formData.seriesNumber}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                                placeholder="e.g., WF-2025-001"
                            />
                        </div>

                        {/* Last User */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Last User
                            </label>
                            <input
                                type="text"
                                name="lastUser"
                                value={formData.lastUser}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                                placeholder="Who last used this item?"
                            />
                        </div>

                        {/* Date Broken */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Date Broken <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                name="dateBroken"
                                value={formData.dateBroken}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                            />
                        </div>

                        {/* Broken Details */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Details <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                name="brokenDetails"
                                value={formData.brokenDetails}
                                onChange={handleInputChange}
                                rows={4}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none resize-none"
                                placeholder="Describe the issue in detail..."
                            />
                        </div>

                        {/* Proof Picture */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Proof Picture
                            </label>
                            <input
                                type="file"
                                name="proofPicture"
                                accept="image/*"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        const reader = new FileReader();
                                        reader.onloadend = () => {
                                            setFormData((prev) => ({ ...prev, proofPicture: reader.result as string }));
                                        };
                                        reader.readAsDataURL(file);
                                    }
                                }}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100 cursor-pointer"
                            />
                            {formData.proofPicture && (
                                <div className="mt-2">
                                    <img src={formData.proofPicture} alt="Proof Preview" className="h-32 w-auto rounded-lg border border-gray-200" />
                                </div>
                            )}
                            <p className="text-xs text-gray-500 mt-1">Optional: Upload an image showing the issue</p>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 flex items-center justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="px-6 py-2.5 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium disabled:opacity-50 flex items-center gap-2"
                    >
                        {isSubmitting && (
                            <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        )}
                        {isSubmitting ? 'Submitting...' : 'Submit Complaint'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SubmitComplaintModal;
