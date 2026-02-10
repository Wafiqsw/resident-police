'use client';

import React, { useState } from 'react';
import { UnitSelector } from '@/components';
import { ResidentProfile } from '@/types';
import { getUnitId } from '@/lib/firestore';

interface ResidentProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    resident: ResidentProfile | null;
    onUpdate?: (resident: ResidentProfile) => void;
    onDelete?: (id: string) => void;
}

const ResidentProfileModal: React.FC<ResidentProfileModalProps> = ({
    isOpen,
    onClose,
    resident,
    onUpdate,
    onDelete,
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedResident, setEditedResident] = useState<ResidentProfile | null>(resident);

    React.useEffect(() => {
        setEditedResident(resident);
        setIsEditing(false);
    }, [resident]);

    if (!isOpen || !resident) return null;

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleSave = () => {
        if (editedResident && onUpdate) {
            onUpdate(editedResident);
        }
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditedResident(resident);
        setIsEditing(false);
    };

    const handleDelete = () => {
        if (onDelete && resident) {
            onDelete(resident.id);
        }
    };

    const handleChange = (field: keyof ResidentProfile, value: any) => {
        if (editedResident) {
            setEditedResident({ ...editedResident, [field]: value });
        }
    };

    const handleChildChange = (index: number, field: 'name' | 'age', value: any) => {
        if (editedResident && editedResident.children) {
            const updatedChildren = [...editedResident.children];
            updatedChildren[index] = { ...updatedChildren[index], [field]: value };
            setEditedResident({ ...editedResident, children: updatedChildren });
        }
    };

    const handleAddChild = () => {
        if (editedResident) {
            const newChildren = [...(editedResident.children || []), { name: '', age: 0 }];
            setEditedResident({ ...editedResident, children: newChildren });
        }
    };

    const handleRemoveChild = (index: number) => {
        if (editedResident && editedResident.children) {
            const newChildren = editedResident.children.filter((_, i) => i !== index);
            setEditedResident({ ...editedResident, children: newChildren });
        }
    };

    const currentResident = isEditing ? editedResident : resident;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-white">Resident Profile</h2>
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
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Personal Information */}
                    <div>
                        <h3 className="text-lg font-semibold text-indigo-700 mb-4">Personal Information</h3>
                        <div className="space-y-3">
                            <InfoRow
                                label="Full Name"
                                value={currentResident?.fullName || ''}
                                isEditing={isEditing}
                                onChange={(val) => handleChange('fullName', val)}
                            />
                            <InfoRow
                                label="Police ID"
                                value={currentResident?.policeId || ''}
                                isEditing={isEditing}
                                onChange={(val) => handleChange('policeId', val)}
                            />
                            <InfoRow
                                label="Rank"
                                value={currentResident?.rank || ''}
                                isEditing={isEditing}
                                onChange={(val) => handleChange('rank', val)}
                            />
                            <InfoRow
                                label="Contact Number"
                                value={currentResident?.contactNumber || ''}
                                isEditing={isEditing}
                                onChange={(val) => handleChange('contactNumber', val)}
                            />
                            <InfoRow
                                label="Email"
                                value={currentResident?.email || ''}
                                isEditing={isEditing}
                                onChange={(val) => handleChange('email', val)}
                            />
                        </div>
                    </div>

                    {/* Residence Details */}
                    <div>
                        <h3 className="text-lg font-semibold text-indigo-700 mb-4">Residence Details</h3>
                        <div className="space-y-3">
                            {isEditing ? (
                                <UnitSelector
                                    houseNumber={currentResident?.houseNumber || { block: '', floor: '', houseNo: '' }}
                                    initialHouseNumber={resident?.houseNumber ? getUnitId(resident.houseNumber) : undefined}
                                    onChange={(houseNumber) => {
                                        if (editedResident) {
                                            setEditedResident({ ...editedResident, houseNumber });
                                        }
                                    }}
                                    className="border-b border-gray-100 pb-3 md:col-span-3"
                                    required
                                />
                            ) : (
                                <>
                                    <div className="flex items-start border-b border-gray-100 pb-3">
                                        <div className="w-1/3">
                                            <p className="text-sm font-semibold text-gray-700">Block</p>
                                        </div>
                                        <div className="w-2/3">
                                            <p className="text-gray-900">{currentResident?.houseNumber.block || ''}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start border-b border-gray-100 pb-3">
                                        <div className="w-1/3">
                                            <p className="text-sm font-semibold text-gray-700">Level</p>
                                        </div>
                                        <div className="w-2/3">
                                            <p className="text-gray-900">{currentResident?.houseNumber.floor || ''}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start border-b border-gray-100 pb-3">
                                        <div className="w-1/3">
                                            <p className="text-sm font-semibold text-gray-700">Unit Number</p>
                                        </div>
                                        <div className="w-2/3">
                                            <p className="text-gray-900">{currentResident?.houseNumber.houseNo || ''}</p>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Family Information */}
                    <div>
                        <h3 className="text-lg font-semibold text-indigo-700 mb-4">Family Information</h3>
                        <div className="space-y-3">
                            {/* Marital Status - DROPDOWN */}
                            <div className="flex items-start border-b border-gray-100 pb-3">
                                <div className="w-1/3">
                                    <p className="text-sm font-semibold text-gray-700">Marital Status</p>
                                </div>
                                <div className="w-2/3">
                                    {isEditing ? (
                                        <select
                                            value={currentResident?.maritalStatus || 'Single'}
                                            onChange={(e) => handleChange('maritalStatus', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm bg-white"
                                        >
                                            <option value="Single">Single</option>
                                            <option value="Married">Married</option>
                                            <option value="Divorced">Divorced</option>
                                        </select>
                                    ) : (
                                        <p className="text-gray-900">{currentResident?.maritalStatus || 'Single'}</p>
                                    )}
                                </div>
                            </div>

                            {/* Spouse fields - only show if Married */}
                            {currentResident?.maritalStatus === 'Married' && (
                                <>
                                    <InfoRow
                                        label="Spouse Name"
                                        value={currentResident?.spouseName || ''}
                                        isEditing={isEditing}
                                        onChange={(val) => handleChange('spouseName', val)}
                                    />
                                    <InfoRow
                                        label="Spouse Contact"
                                        value={currentResident?.spouseContact || ''}
                                        isEditing={isEditing}
                                        onChange={(val) => handleChange('spouseContact', val)}
                                    />
                                    <InfoRow
                                        label="Spouse Occupation"
                                        value={currentResident?.spouseOccupation || ''}
                                        isEditing={isEditing}
                                        onChange={(val) => handleChange('spouseOccupation', val)}
                                    />
                                </>
                            )}

                            {/* Number of Children - show for Married or Divorced */}
                            {(currentResident?.maritalStatus === 'Married' || currentResident?.maritalStatus === 'Divorced') && (
                                <div className="flex items-start border-b border-gray-100 pb-3">
                                    <div className="w-1/3">
                                        <p className="text-sm font-semibold text-gray-700">Number of Children</p>
                                    </div>
                                    <div className="w-2/3">
                                        <p className="text-gray-900">{currentResident?.children?.length || 0}</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Children Details - show if Married or Divorced */}
                        {(currentResident?.maritalStatus === 'Married' || currentResident?.maritalStatus === 'Divorced') && (
                            <div className="mt-4">
                                <div className="flex items-center justify-between mb-3">
                                    <h4 className="text-md font-semibold text-indigo-600">Children Details</h4>
                                    {isEditing && (
                                        <button
                                            onClick={handleAddChild}
                                            className="flex items-center justify-center w-8 h-8 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                                            title="Add child"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                            </svg>
                                        </button>
                                    )}
                                </div>
                                {currentResident.children && currentResident.children.length > 0 ? (
                                    <div className="space-y-3">
                                        {currentResident.children.map((child, index) => (
                                            <div key={index} className="bg-gray-50 p-3 rounded-lg">
                                                <div className="flex items-start justify-between mb-2">
                                                    <p className="text-sm font-medium text-gray-600">Child {index + 1}</p>
                                                    {isEditing && (
                                                        <button
                                                            onClick={() => handleRemoveChild(index)}
                                                            className="text-red-600 hover:text-red-700 transition-colors"
                                                            title="Remove child"
                                                        >
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                            </svg>
                                                        </button>
                                                    )}
                                                </div>
                                                {isEditing ? (
                                                    <div className="space-y-2">
                                                        <div>
                                                            <label className="block text-xs font-medium text-gray-600 mb-1">Name</label>
                                                            <input
                                                                type="text"
                                                                value={child.name}
                                                                onChange={(e) => handleChildChange(index, 'name', e.target.value)}
                                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm"
                                                                placeholder="Child name"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-xs font-medium text-gray-600 mb-1">Age</label>
                                                            <input
                                                                type="number"
                                                                value={child.age}
                                                                onChange={(e) => handleChildChange(index, 'age', parseInt(e.target.value) || 0)}
                                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm"
                                                                placeholder="Age in years"
                                                            />
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <p className="text-gray-900">
                                                        {child.name} ({child.age} years old)
                                                    </p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="bg-gray-50 p-4 rounded-lg text-center">
                                        <p className="text-gray-500 text-sm">No children added yet</p>
                                        {isEditing && (
                                            <button
                                                onClick={handleAddChild}
                                                className="mt-2 text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                                            >
                                                Add first child
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="border-t border-gray-200 px-6 py-4 flex items-center justify-between bg-gray-50">
                    <div>
                        {!isEditing && onDelete && (
                            <button
                                onClick={handleDelete}
                                className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium flex items-center gap-2"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Delete Account
                            </button>
                        )}
                    </div>
                    <div className="flex items-center gap-3">
                        {isEditing ? (
                            <>
                                <button
                                    onClick={handleCancel}
                                    className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                                >
                                    Save Changes
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={handleEdit}
                                className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium flex items-center gap-2"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                Edit Profile
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

// Helper component for info rows
interface InfoRowProps {
    label: string;
    value: string;
    isEditing: boolean;
    onChange: (value: string) => void;
}

const InfoRow: React.FC<InfoRowProps> = ({ label, value, isEditing, onChange }) => {
    return (
        <div className="flex items-start border-b border-gray-100 pb-3">
            <div className="w-1/3">
                <p className="text-sm font-semibold text-gray-700">{label}</p>
            </div>
            <div className="w-2/3">
                {isEditing ? (
                    <input
                        type="text"
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm"
                    />
                ) : (
                    <p className="text-gray-900">{value}</p>
                )}
            </div>
        </div>
    );
};

export default ResidentProfileModal;
