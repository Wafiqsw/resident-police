'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Layout, ResidentComplaintDetailModal, SubmitComplaintModal, EditComplaintModal } from '@/components';
import { Complaint, ResidentProfile } from '@/types';
import { createComplaint, getComplaints, updateComplaint, deleteComplaint } from '@/lib/firestore';
import { uploadBase64Image, deleteFile } from '@/lib/storage';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';



const ResidentComplaint = () => {
    const { user, profile, loading: authLoading } = useAuth();
    const router = useRouter();
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
    const [complaints, setComplaints] = useState<Complaint[]>([]);
    const [isInitialLoading, setIsInitialLoading] = useState(true);

    const fetchComplaints = useCallback(async () => {
        if (!user) return;
        try {
            const data = await getComplaints({ creatorId: user.uid });
            setComplaints(data);
        } catch (error) {
            console.error('Error fetching complaints:', error);
        } finally {
            setIsInitialLoading(false);
        }
    }, [user]);

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login');
            return;
        }
        if (user) {
            fetchComplaints();
        }
    }, [user, authLoading, router, fetchComplaints]);

    if (authLoading || isInitialLoading) {
        return (
            <Layout userType="resident">
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="flex flex-col items-center gap-4">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                        <p className="text-gray-500 font-medium animate-pulse">Loading your complaints...</p>
                    </div>
                </div>
            </Layout>
        );
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending':
                return 'bg-orange-100 text-orange-700';
            case 'accepted':
                return 'bg-blue-100 text-blue-700';
            case 'resolved':
                return 'bg-green-100 text-green-700';
            case 'rejected':
                return 'bg-red-100 text-red-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    const getStatusText = (status: string) => {
        return status.charAt(0).toUpperCase() + status.slice(1);
    };

    const handleViewComplaint = (id: string) => {
        const complaint = complaints.find((c) => c.id === id);
        if (complaint) {
            setSelectedComplaint(complaint);
            setIsDetailModalOpen(true);
        }
    };

    const handleSubmitComplaint = async (newComplaint: Partial<Complaint>) => {
        if (!user || !profile) return;

        try {
            let imageUrl = '';
            if (newComplaint.proofPicture && newComplaint.proofPicture.startsWith('data:image')) {
                const storagePath = `complaints/${user.uid}/${Date.now()}_proof.jpg`;
                imageUrl = await uploadBase64Image(newComplaint.proofPicture, storagePath);
            }

            const complaintData: Omit<Complaint, 'id'> = {
                issue: newComplaint.issue || '',
                category: newComplaint.category || 'Other',
                seriesNumber: newComplaint.seriesNumber || '',
                lastUser: newComplaint.lastUser || '',
                dateBroken: newComplaint.dateBroken || new Date().toISOString().split('T')[0],
                brokenDetails: newComplaint.brokenDetails || '',
                proofPicture: imageUrl || newComplaint.proofPicture || '',
                creator: profile as ResidentProfile,
                status: 'pending',
                dateSubmitted: new Date().toISOString(),
            };

            await createComplaint(complaintData);
            await fetchComplaints();
            setIsSubmitModalOpen(false);
            alert('Complaint submitted successfully!');
        } catch (error) {
            console.error('Error submitting complaint:', error);
            alert('Failed to submit complaint. Please try again.');
            throw error;
        }
    };

    const handleEditComplaint = (id: string) => {
        const complaint = complaints.find((c) => c.id === id);
        if (complaint) {
            setSelectedComplaint(complaint);
            setIsEditModalOpen(true);
        }
    };

    const handleUpdateComplaint = async (updatedComplaint: Complaint) => {
        if (!user) return;
        try {
            const { id, ...updates } = updatedComplaint;

            // If proofPicture is a new base64 string, upload it
            if (updates.proofPicture && updates.proofPicture.startsWith('data:image')) {
                const storagePath = `complaints/${user.uid}/${Date.now()}_proof.jpg`;
                updates.proofPicture = await uploadBase64Image(updates.proofPicture, storagePath);
            }

            await updateComplaint(id, updates);
            await fetchComplaints();
            setIsEditModalOpen(false);
            alert('Complaint updated successfully!');
        } catch (error) {
            console.error('Error updating complaint:', error);
            alert('Failed to update complaint.');
        }
    };

    const handleDeleteComplaint = async (id: string) => {
        if (!confirm('Are you sure you want to delete this complaint?')) return;
        try {
            // Find the complaint to get its image URL
            const complaint = complaints.find(c => c.id === id);
            if (complaint?.proofPicture) {
                await deleteFile(complaint.proofPicture);
            }

            await deleteComplaint(id);
            await fetchComplaints();
            setIsDetailModalOpen(false);
            alert('Complaint deleted successfully!');
        } catch (error) {
            console.error('Error deleting complaint:', error);
            alert('Failed to delete complaint.');
        }
    };

    return (
        <Layout userType="resident">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">My Complaints</h1>
                        <p className="text-gray-600 mt-1">Track and manage your submitted complaints</p>
                    </div>
                    <button
                        onClick={() => setIsSubmitModalOpen(true)}
                        className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium flex items-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        New Complaint
                    </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-white rounded-xl shadow-sm border-l-4 border-orange-500 p-6">
                        <h3 className="text-gray-600 text-sm font-medium mb-2">Pending</h3>
                        <p className="text-3xl font-bold text-gray-900">
                            {complaints.filter((c) => c.status === 'pending').length}
                        </p>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border-l-4 border-blue-500 p-6">
                        <h3 className="text-gray-600 text-sm font-medium mb-2">Accepted</h3>
                        <p className="text-3xl font-bold text-gray-900">
                            {complaints.filter((c) => c.status === 'accepted').length}
                        </p>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border-l-4 border-green-500 p-6">
                        <h3 className="text-gray-600 text-sm font-medium mb-2">Resolved</h3>
                        <p className="text-3xl font-bold text-gray-900">
                            {complaints.filter((c) => c.status === 'resolved').length}
                        </p>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border-l-4 border-red-500 p-6">
                        <h3 className="text-gray-600 text-sm font-medium mb-2">Rejected</h3>
                        <p className="text-3xl font-bold text-gray-900">
                            {complaints.filter((c) => c.status === 'rejected').length}
                        </p>
                    </div>
                </div>

                {/* Complaints List */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-lg font-bold text-gray-900">All Complaints</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        ID
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Issue
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Category
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Date Submitted
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {complaints.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-4 py-12 text-center">
                                            <div className="flex flex-col items-center justify-center space-y-3">
                                                <div className="bg-gray-50 p-4 rounded-full">
                                                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                    </svg>
                                                </div>
                                                <div className="max-w-xs mx-auto">
                                                    <p className="text-lg font-bold text-gray-900">No complaints yet</p>
                                                    <p className="text-sm text-gray-500 mt-1">
                                                        If you're having issues with your residence, click the "New Complaint" button to let us know.
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={() => setIsSubmitModalOpen(true)}
                                                    className="mt-2 text-indigo-600 font-bold hover:text-indigo-700 text-sm transition-colors"
                                                >
                                                    Submit your first complaint →
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    complaints.map((complaint) => (
                                        <tr key={complaint.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-4 py-4 text-sm font-medium text-gray-900">{complaint.id}</td>
                                            <td className="px-4 py-4 text-sm text-gray-700">{complaint.issue}</td>
                                            <td className="px-4 py-4 text-sm text-gray-700">{complaint.category}</td>
                                            <td className="px-4 py-4 text-sm text-gray-700">
                                                {new Date(complaint.dateSubmitted).toLocaleDateString()}
                                            </td>
                                            <td className="px-4 py-4">
                                                <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(complaint.status)}`}>
                                                    {getStatusText(complaint.status)}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4">
                                                <button
                                                    onClick={() => handleViewComplaint(complaint.id)}
                                                    className="text-indigo-600 hover:text-indigo-700 font-medium text-sm"
                                                >
                                                    View Details
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Complaint Detail Modal */}
            <ResidentComplaintDetailModal
                isOpen={isDetailModalOpen}
                onClose={() => {
                    setIsDetailModalOpen(false);
                    setSelectedComplaint(null);
                }}
                complaint={selectedComplaint}
                onEdit={handleEditComplaint}
                onDelete={handleDeleteComplaint}
            />

            {/* Submit Complaint Modal */}
            <SubmitComplaintModal
                isOpen={isSubmitModalOpen}
                onClose={() => setIsSubmitModalOpen(false)}
                onSubmit={handleSubmitComplaint}
            />

            {/* Edit Complaint Modal */}
            <EditComplaintModal
                isOpen={isEditModalOpen}
                onClose={() => {
                    setIsEditModalOpen(false);
                    setSelectedComplaint(null);
                }}
                complaint={selectedComplaint}
                onUpdate={handleUpdateComplaint}
            />
        </Layout>
    );
};

export default ResidentComplaint;
