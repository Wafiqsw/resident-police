'use client';

import React, { useState, useEffect } from 'react';
import { ResidentProfile } from '@/types';
import { UnitSelector } from '@/components';
import { getUnitId } from '@/lib/firestore';

interface EditProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    resident: ResidentProfile;
    onSave: (resident: ResidentProfile) => Promise<void> | void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({
    isOpen,
    onClose,
    resident,
    onSave,
}) => {
    const [formData, setFormData] = useState<ResidentProfile>(resident);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (resident) {
            setFormData(resident);
        }
    }, [resident]);

    useEffect(() => {
        if (!isOpen) {
            setIsSubmitting(false);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleAddChild = () => {
        setFormData((prev) => ({
            ...prev,
            children: [...(prev.children || []), { name: '', age: 0 }],
            numberOfChildren: (prev.children?.length || 0) + 1,
        }));
    };

    const handleRemoveChild = (index: number) => {
        setFormData((prev) => ({
            ...prev,
            children: prev.children?.filter((_, i) => i !== index),
            numberOfChildren: (prev.children?.length || 1) - 1,
        }));
    };

    const handleChildChange = (index: number, field: 'name' | 'age', value: string | number) => {
        setFormData((prev) => ({
            ...prev,
            children: prev.children?.map((child, i) =>
                i === index ? { ...child, [field]: value } : child
            ),
        }));
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            await onSave(formData);
        } catch (error) {
            // Error is handled by parent component
            console.error('Error in modal submit:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-white">Edit Profile</h2>
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
                    <div className="space-y-6">
                        {/* Personal Information */}
                        <div>
                            <h3 className="text-lg font-bold text-indigo-600 mb-4">Personal Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Full Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Police ID
                                    </label>
                                    <input
                                        type="text"
                                        name="policeId"
                                        value={formData.policeId}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Rank
                                    </label>
                                    <input
                                        type="text"
                                        name="rank"
                                        value={formData.rank}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Contact Number <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="tel"
                                        name="contactNumber"
                                        value={formData.contactNumber}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Email <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Residence Details */}
                        <div>
                            <h3 className="text-lg font-bold text-indigo-600 mb-4">Residence Details</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <UnitSelector
                                    houseNumber={formData.houseNumber}
                                    initialHouseNumber={getUnitId(resident.houseNumber)}
                                    onChange={(houseNumber) => setFormData(prev => ({ ...prev, houseNumber }))}
                                    required
                                    className="md:col-span-3"
                                />
                            </div>
                        </div>

                        {/* Family Information */}
                        <div>
                            <h3 className="text-lg font-bold text-indigo-600 mb-4">Family Information</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Marital Status
                                    </label>
                                    <select
                                        name="maritalStatus"
                                        value={formData.maritalStatus}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                                    >
                                        <option value="Single">Single</option>
                                        <option value="Married">Married</option>
                                        <option value="Divorced">Divorced</option>
                                        <option value="Widowed">Widowed</option>
                                    </select>
                                </div>

                                {formData.maritalStatus === 'Married' && (
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Spouse Name
                                            </label>
                                            <input
                                                type="text"
                                                name="spouseName"
                                                value={formData.spouseName || ''}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Spouse Contact
                                            </label>
                                            <input
                                                type="tel"
                                                name="spouseContact"
                                                value={formData.spouseContact || ''}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Spouse Occupation
                                            </label>
                                            <input
                                                type="text"
                                                name="spouseOccupation"
                                                value={formData.spouseOccupation || ''}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                                            />
                                        </div>
                                    </div>
                                )}

                                {(formData.maritalStatus === 'Married' || formData.maritalStatus === 'Divorced') && (
                                    <div>
                                        <div className="flex items-center justify-between mb-3">
                                            <label className="block text-sm font-semibold text-gray-700">Children</label>
                                            <button
                                                type="button"
                                                onClick={handleAddChild}
                                                className="px-3 py-1 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
                                            >
                                                + Add Child
                                            </button>
                                        </div>
                                        <div className="space-y-2">
                                            {formData.children && formData.children.length > 0 && (
                                                <div className="flex gap-2 px-1">
                                                    <div className="flex-1 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                                        Child Name
                                                    </div>
                                                    <div className="w-24 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                                        Age
                                                    </div>
                                                    <div className="w-[44px]"></div> {/* Spacer for the delete button */}
                                                </div>
                                            )}
                                            {formData.children?.map((child, index) => (
                                                <div key={index} className="flex gap-2">
                                                    <input
                                                        type="text"
                                                        placeholder="Child Name"
                                                        value={child.name}
                                                        onChange={(e) => handleChildChange(index, 'name', e.target.value)}
                                                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                                                    />
                                                    <input
                                                        type="number"
                                                        placeholder="Age"
                                                        min="0"
                                                        value={child.age}
                                                        onChange={(e) => {
                                                            const val = parseInt(e.target.value) || 0;
                                                            handleChildChange(index, 'age', Math.max(0, val));
                                                        }}
                                                        className="w-24 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveChild(index)}
                                                        className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
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
                        className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {isSubmitting && (
                            <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        )}
                        {isSubmitting ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditProfileModal;
