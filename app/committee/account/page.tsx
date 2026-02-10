'use client';

import React, { useState, useEffect } from 'react';
import { Layout, PasswordUpdateModal } from '@/components';
import { CommitteeMember } from '@/types';
import { useAuth } from '@/hooks/useAuth';
import { updateUserProfile, changePassword } from '@/lib/auth';

const CommitteeAccount = () => {
    const { user, profile, loading } = useAuth();
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [committeeData, setCommitteeData] = useState<CommitteeMember | null>(null);
    const [isUpdating, setIsUpdating] = useState(false);
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [editName, setEditName] = useState('');

    useEffect(() => {
        if (profile && profile.role === 'committee') {
            setCommitteeData(profile as CommitteeMember);
            setEditName((profile as CommitteeMember).fullName || '');
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

    const handleUpdateName = async () => {
        if (!user || !editName.trim()) return;

        setIsUpdating(true);
        try {
            const updated = await updateUserProfile(user.uid, { fullName: editName });
            setCommitteeData(updated as CommitteeMember);
            setIsEditingProfile(false);
            alert('Name updated successfully!');
        } catch (error: any) {
            console.error('Error updating profile:', error);
            alert('Failed to update name.');
        } finally {
            setIsUpdating(false);
        }
    };

    if (loading || !committeeData) {
        return (
            <Layout userType="committee">
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout userType="committee">
            <div className="max-w-4xl mx-auto space-y-6">
                {/* Header */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h1 className="text-2xl font-bold text-gray-900">Account Settings</h1>
                    <p className="text-gray-600 mt-1">Manage your committee member profile and security</p>
                </div>

                {/* Profile Information */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-indigo-600 to-purple-600">
                        <h2 className="text-lg font-bold text-white">Profile Information</h2>
                    </div>
                    <div className="p-6 space-y-6">
                        {/* Name Field */}
                        <div className="flex flex-col md:flex-row md:items-center border-b border-gray-100 pb-6">
                            <div className="w-full md:w-1/3 mb-2 md:mb-0">
                                <p className="text-sm font-semibold text-gray-700">Full Name</p>
                                <p className="text-xs text-gray-500">Your professional name for the portal</p>
                            </div>
                            <div className="w-full md:w-2/3 flex items-center gap-3">
                                {isEditingProfile ? (
                                    <>
                                        <input
                                            type="text"
                                            value={editName}
                                            onChange={(e) => setEditName(e.target.value)}
                                            className="flex-1 px-4 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                            placeholder="Enter your full name"
                                        />
                                        <button
                                            onClick={handleUpdateName}
                                            disabled={isUpdating}
                                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                                        >
                                            Save
                                        </button>
                                        <button
                                            onClick={() => {
                                                setIsEditingProfile(false);
                                                setEditName(committeeData.fullName || '');
                                            }}
                                            className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                                        >
                                            Cancel
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <p className="flex-1 text-gray-900 font-medium">{committeeData.fullName || 'Not Set'}</p>
                                        <button
                                            onClick={() => setIsEditingProfile(true)}
                                            className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                                        >
                                            Change Name
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Email Field (ReadOnly) */}
                        <div className="flex flex-col md:flex-row md:items-center pb-2">
                            <div className="w-full md:w-1/3 mb-2 md:mb-0">
                                <p className="text-sm font-semibold text-gray-700">Email Address</p>
                                <p className="text-xs text-gray-500">Your registered committee email</p>
                            </div>
                            <div className="w-full md:w-2/3">
                                <p className="text-gray-900 bg-gray-50 px-4 py-2 rounded-lg border border-gray-100">{committeeData.email}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Security Settings */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-red-600 to-orange-600">
                        <h2 className="text-lg font-bold text-white">Security & Privacy</h2>
                    </div>
                    <div className="p-6">
                        <div className="flex items-center justify-between p-4 bg-red-50 rounded-xl border border-red-100">
                            <div>
                                <h3 className="font-bold text-red-900">Update Password</h3>
                                <p className="text-sm text-red-700 mt-1">Keep your access secure with a strong password</p>
                            </div>
                            <button
                                onClick={() => setIsPasswordModalOpen(true)}
                                className="px-6 py-2 bg-white text-red-600 border border-red-200 rounded-lg hover:bg-red-600 hover:text-white transition-all font-bold text-sm shadow-sm"
                            >
                                Change Password
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Password Update Modal */}
            <PasswordUpdateModal
                isOpen={isPasswordModalOpen}
                onClose={() => setIsPasswordModalOpen(false)}
                onUpdate={handlePasswordUpdate}
            />
        </Layout>
    );
};

export default CommitteeAccount;
