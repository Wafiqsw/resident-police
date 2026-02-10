'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Layout, BlockSelector, ResidentCard, ResidentProfileModal } from '@/components';
import { ResidentProfile } from '@/types';
import { getAllResidents, updateUserProfile, deleteUserAccount, getUnitId } from '@/lib/firestore';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';



const ResidentsPage = () => {
    const { user, profile, loading: authLoading } = useAuth();
    const router = useRouter();
    const [residents, setResidents] = useState<ResidentProfile[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedBlock, setSelectedBlock] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedResident, setSelectedResident] = useState<ResidentProfile | null>(null);

    const fetchResidentsData = useCallback(async () => {
        try {
            const data = await getAllResidents();
            setResidents(data);
        } catch (error) {
            console.error('Error fetching residents:', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (!authLoading && (!user || profile?.role !== 'committee')) {
            router.push('/login');
            return;
        }
        if (user) {
            fetchResidentsData();
        }
    }, [user, profile, authLoading, router, fetchResidentsData]);

    const handleBlockSelect = (blockId: string) => {
        setSelectedBlock(blockId);
    };

    const handleViewProfile = (residentId: string) => {
        const resident = residents.find((r) => r.id === residentId);
        if (resident) {
            setSelectedResident(resident);
            setIsModalOpen(true);
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedResident(null);
    };

    const handleUpdateResident = async (updatedProfile: ResidentProfile) => {
        try {
            const { id, ...updates } = updatedProfile;
            await updateUserProfile(id, updates);
            await fetchResidentsData();
            handleCloseModal();
            alert('Resident profile updated successfully!');
        } catch (error) {
            console.error('Error updating resident:', error);
            alert('Failed to update resident profile.');
        }
    };

    const handleDeleteResident = async (residentId: string) => {
        if (!confirm('Are you sure you want to delete this resident account? This action cannot be undone.')) return;
        try {
            await deleteUserAccount(residentId);
            await fetchResidentsData();
            handleCloseModal();
            alert('Resident account deleted successfully.');
        } catch (error) {
            console.error('Error deleting resident:', error);
            alert('Failed to delete resident account.');
        }
    };

    const filteredResidents = useMemo(() => {
        let filtered = residents;

        // Filter by block if one is selected
        if (selectedBlock) {
            filtered = filtered.filter(res => res.houseNumber.block === selectedBlock);
        }

        // Filter by search query
        if (searchQuery.trim()) {
            const queryText = searchQuery.toLowerCase();
            filtered = filtered.filter(res =>
                res.fullName.toLowerCase().includes(queryText) ||
                res.policeId.toLowerCase().includes(queryText) ||
                getUnitId(res.houseNumber).toLowerCase().includes(queryText)
            );
        }

        return filtered;
    }, [selectedBlock, searchQuery, residents]);

    if (authLoading || isLoading) {
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
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Page Header */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Residents Management</h1>
                    <p className="text-gray-600">Select a housing block to view and manage residents</p>
                </div>

                {/* Main Content - Side by Side Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Side - Block Selector */}
                    <div className="lg:col-span-1">
                        <BlockSelector
                            title="Please select a block"
                            onBlockSelect={handleBlockSelect}
                            columns={2}
                        />
                    </div>

                    {/* Right Side - Resident Cards */}
                    <div className="lg:col-span-2">
                        {selectedBlock ? (
                            <div className="space-y-4 max-h-[800px] overflow-y-auto">
                                {/* Block Header with Search */}
                                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-0 z-10">
                                    <div className="flex items-center justify-between mb-4">
                                        <h2 className="text-xl font-bold text-gray-900">BLOK {selectedBlock}</h2>
                                        <span className="text-sm text-gray-600">
                                            {filteredResidents.length} resident{filteredResidents.length !== 1 ? 's' : ''} found
                                        </span>
                                    </div>

                                    {/* Search Form */}
                                    <div className="relative">
                                        <input
                                            type="text"
                                            placeholder="Search by name, police ID, or house number..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                                        />
                                        <svg
                                            className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                            />
                                        </svg>
                                    </div>
                                </div>

                                {/* Resident Cards */}
                                <div className="space-y-4 px-1">
                                    {filteredResidents.length > 0 ? (
                                        filteredResidents.map((resident) => (
                                            <ResidentCard
                                                key={resident.id}
                                                resident={{
                                                    id: resident.id,
                                                    name: resident.fullName,
                                                    policeId: resident.policeId,
                                                    houseNo: `${resident.houseNumber.floor}-${resident.houseNumber.houseNo}`,
                                                    block: resident.houseNumber.block
                                                }}
                                                onViewProfile={handleViewProfile}
                                            />
                                        ))
                                    ) : (
                                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                                            <svg
                                                className="w-16 h-16 text-gray-300 mx-auto mb-4"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                                                />
                                            </svg>
                                            <p className="text-gray-500 text-lg font-medium">No residents found</p>
                                            <p className="text-gray-400 text-sm mt-2">
                                                {searchQuery ? 'Try adjusting your search query' : 'No residents in this block'}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border border-indigo-100 p-12 text-center h-full flex flex-col items-center justify-center min-h-[400px]">
                                <svg
                                    className="w-16 h-16 text-indigo-400 mx-auto mb-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Select a block to get started</h3>
                                <p className="text-gray-600">Choose a housing block on the left to view residents</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Resident Profile Modal */}
            <ResidentProfileModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                resident={selectedResident}
                onUpdate={handleUpdateResident}
                onDelete={handleDeleteResident}
            />
        </Layout>
    );
};

export default ResidentsPage;
