'use client';

import React, { useState, useEffect } from 'react';
import { Layout, PasswordUpdateModal, EditProfileModal } from '@/components';
import { ResidentProfile } from '@/types';
import { useAuth } from '@/hooks/useAuth';
import { updateUserProfile, changePassword } from '@/lib/auth';

const ResidentAccount = () => {
    const { user, profile, loading } = useAuth();
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [residentData, setResidentData] = useState<ResidentProfile | null>(null);
    const [isUpdating, setIsUpdating] = useState(false);

    // Load user profile
    useEffect(() => {
        if (profile && profile.role === 'resident') {
            setResidentData(profile as ResidentProfile);
        }
    }, [profile]);

    const handlePasswordUpdate = async (currentPassword: string, newPassword: string) => {
        setIsUpdating(true);
        try {
            await changePassword(currentPassword, newPassword);
            setIsPasswordModalOpen(false);
            alert('Password updated successfully!');
        } catch (error: any) {
            console.error('Error updating password:', error);
            alert(error.message || 'Failed to update password. Please check your current password.');
        } finally {
            setIsUpdating(false);
        }
    };

    const handleProfileUpdate = async (updatedResident: ResidentProfile) => {
        if (!user) return;

        setIsUpdating(true);
        try {
            // Remove password field if it exists (shouldn't be in profile updates)
            const { password, ...profileData } = updatedResident;

            const updated = await updateUserProfile(user.uid, profileData);
            setResidentData(updated as ResidentProfile);
            setIsProfileModalOpen(false);
            alert('Profile updated successfully!');
        } catch (error: any) {
            console.error('Error updating profile:', error);
            alert(error.message || 'Failed to update profile. Please try again.');
        } finally {
            setIsUpdating(false);
        }
    };

    if (loading || !residentData) {
        return (
            <Layout userType="resident">
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-gray-500 font-medium">Loading your profile...</p>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout userType="resident">
            <div className="max-w-4xl mx-auto space-y-6">
                {/* Header */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h1 className="text-2xl font-bold text-gray-900">My Account</h1>
                    <p className="text-gray-600 mt-1">Manage your personal information and settings</p>
                </div>

                {/* Profile Information */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-indigo-600 to-purple-600">
                        <h2 className="text-lg font-bold text-white">Profile Information</h2>
                    </div>
                    <div className="p-6 space-y-4">
                        {/* Name */}
                        <div className="flex border-b border-gray-200 pb-3">
                            <div className="w-1/3">
                                <p className="text-sm font-semibold text-gray-700">Full Name</p>
                            </div>
                            <div className="w-2/3">
                                <p className="text-gray-900">{residentData.fullName}</p>
                            </div>
                        </div>

                        {/* Police ID */}
                        <div className="flex border-b border-gray-200 pb-3">
                            <div className="w-1/3">
                                <p className="text-sm font-semibold text-gray-700">Police ID</p>
                            </div>
                            <div className="w-2/3">
                                <p className="text-gray-900">{residentData.policeId}</p>
                            </div>
                        </div>

                        {/* Rank */}
                        <div className="flex border-b border-gray-200 pb-3">
                            <div className="w-1/3">
                                <p className="text-sm font-semibold text-gray-700">Rank</p>
                            </div>
                            <div className="w-2/3">
                                <p className="text-gray-900">{residentData.rank}</p>
                            </div>
                        </div>

                        {/* Email */}
                        <div className="flex border-b border-gray-200 pb-3">
                            <div className="w-1/3">
                                <p className="text-sm font-semibold text-gray-700">Email</p>
                            </div>
                            <div className="w-2/3">
                                <p className="text-gray-900">{residentData.email}</p>
                            </div>
                        </div>

                        {/* Phone */}
                        <div className="flex border-b border-gray-200 pb-3">
                            <div className="w-1/3">
                                <p className="text-sm font-semibold text-gray-700">Contact Number</p>
                            </div>
                            <div className="w-2/3">
                                <p className="text-gray-900">{residentData.contactNumber}</p>
                            </div>
                        </div>

                        {/* Block */}
                        <div className="flex border-b border-gray-200 pb-3">
                            <div className="w-1/3">
                                <p className="text-sm font-semibold text-gray-700">Block</p>
                            </div>
                            <div className="w-2/3">
                                <p className="text-gray-900">{residentData.houseNumber.block}</p>
                            </div>
                        </div>

                        {/* Level */}
                        <div className="flex border-b border-gray-200 pb-3">
                            <div className="w-1/3">
                                <p className="text-sm font-semibold text-gray-700">Level</p>
                            </div>
                            <div className="w-2/3">
                                <p className="text-gray-900">{residentData.houseNumber.floor}</p>
                            </div>
                        </div>

                        {/* Unit Number */}
                        <div className="flex border-b border-gray-200 pb-3">
                            <div className="w-1/3">
                                <p className="text-sm font-semibold text-gray-700">Unit Number</p>
                            </div>
                            <div className="w-2/3">
                                <p className="text-gray-900">{residentData.houseNumber.houseNo}</p>
                            </div>
                        </div>


                        {/* Marital Status */}
                        <div className="flex border-b border-gray-200 pb-3">
                            <div className="w-1/3">
                                <p className="text-sm font-semibold text-gray-700">Marital Status</p>
                            </div>
                            <div className="w-2/3">
                                <p className="text-gray-900">{residentData.maritalStatus}</p>
                            </div>
                        </div>

                        {/* Spouse Info (if married) */}
                        {residentData.maritalStatus === 'Married' && (
                            <>
                                <div className="flex border-b border-gray-200 pb-3">
                                    <div className="w-1/3">
                                        <p className="text-sm font-semibold text-gray-700">Spouse Name</p>
                                    </div>
                                    <div className="w-2/3">
                                        <p className="text-gray-900">{residentData.spouseName}</p>
                                    </div>
                                </div>
                                <div className="flex border-b border-gray-200 pb-3">
                                    <div className="w-1/3">
                                        <p className="text-sm font-semibold text-gray-700">Spouse Contact</p>
                                    </div>
                                    <div className="w-2/3">
                                        <p className="text-gray-900">{residentData.spouseContact}</p>
                                    </div>
                                </div>
                                <div className="flex border-b border-gray-200 pb-3">
                                    <div className="w-1/3">
                                        <p className="text-sm font-semibold text-gray-700">Spouse Occupation</p>
                                    </div>
                                    <div className="w-2/3">
                                        <p className="text-gray-900">{residentData.spouseOccupation}</p>
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Number of Children */}
                        {(residentData.maritalStatus === 'Married' || residentData.maritalStatus === 'Divorced') && (
                            <div className="flex border-b border-gray-200 pb-3">
                                <div className="w-1/3">
                                    <p className="text-sm font-semibold text-gray-700">Number of Children</p>
                                </div>
                                <div className="w-2/3">
                                    <p className="text-gray-900">{residentData.numberOfChildren || 0}</p>
                                </div>
                            </div>
                        )}

                        {/* Children Details */}
                        {residentData.children && residentData.children.length > 0 && (
                            <div className="flex">
                                <div className="w-1/3">
                                    <p className="text-sm font-semibold text-gray-700">Children</p>
                                </div>
                                <div className="w-2/3 space-y-2">
                                    {residentData.children.map((child, index) => (
                                        <p key={index} className="text-gray-900">
                                            {child.name} ({child.age} years old)
                                        </p>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Security Settings */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-indigo-600 to-purple-600">
                        <h2 className="text-lg font-bold text-white">Security Settings</h2>
                    </div>
                    <div className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-semibold text-gray-900">Password</h3>
                                <p className="text-sm text-gray-600 mt-1">Last updated 30 days ago</p>
                            </div>
                            <button
                                onClick={() => setIsPasswordModalOpen(true)}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium text-sm"
                            >
                                Change Password
                            </button>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3">
                    <button
                        onClick={() => setIsProfileModalOpen(true)}
                        className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                    >
                        Edit Profile
                    </button>
                </div>
            </div>

            {/* Password Update Modal */}
            <PasswordUpdateModal
                isOpen={isPasswordModalOpen}
                onClose={() => setIsPasswordModalOpen(false)}
                onUpdate={handlePasswordUpdate}
            />

            {/* Profile Edit Modal */}
            <EditProfileModal
                isOpen={isProfileModalOpen}
                onClose={() => setIsProfileModalOpen(false)}
                resident={residentData}
                onSave={handleProfileUpdate}
            />
        </Layout>
    );
};

export default ResidentAccount;
