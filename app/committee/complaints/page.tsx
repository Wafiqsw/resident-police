'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Layout, ComplaintCard, ComplaintDetailModal, RejectReasonModal } from '@/components';
import { Complaint, CommitteeMember } from '@/types';
import { getComplaints, updateComplaint } from '@/lib/firestore';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';



const ComplaintsPage = () => {
    const { user, profile, loading: authLoading } = useAuth();
    const router = useRouter();
    const [complaints, setComplaints] = useState<Complaint[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
    const [complaintToReject, setComplaintToReject] = useState<string>('');

    const fetchComplaintsData = useCallback(async () => {
        try {
            const data = await getComplaints();
            setComplaints(data);
        } catch (error) {
            console.error('Error fetching complaints:', error);
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
            fetchComplaintsData();
        }
    }, [user, profile, authLoading, router, fetchComplaintsData]);

    if (authLoading || isLoading) {
        return (
            <Layout userType="committee">
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                </div>
            </Layout>
        );
    }

    // Filter complaints based on search query
    const filteredComplaints = complaints.filter((complaint) => {
        const query = searchQuery.toLowerCase();
        return (
            complaint.id.toLowerCase().includes(query) ||
            complaint.creator.fullName.toLowerCase().includes(query) ||
            complaint.creator.block.toLowerCase().includes(query) ||
            complaint.issue.toLowerCase().includes(query)
        );
    });

    const pendingComplaints = filteredComplaints.filter((c) => c.status === 'pending');
    const evaluatedComplaints = filteredComplaints.filter((c) => c.status !== 'pending');

    const handleEvaluate = (id: string) => {
        const complaint = complaints.find((c) => c.id === id);
        if (complaint) {
            setSelectedComplaint(complaint);
            setIsModalOpen(true);
        }
    };

    const handleView = (id: string) => {
        const complaint = complaints.find((c) => c.id === id);
        if (complaint) {
            setSelectedComplaint(complaint);
            setIsModalOpen(true);
        }
    };

    const handleAccept = async (id: string) => {
        if (!profile) return;
        try {
            await updateComplaint(id, {
                status: 'accepted',
                handledBy: profile as CommitteeMember,
                handledAt: new Date().toISOString(),
            });
            await fetchComplaintsData();
            setIsModalOpen(false);
            alert('Complaint accepted.');
        } catch (error) {
            console.error('Error accepting complaint:', error);
            alert('Failed to accept complaint.');
        }
    };

    const handleReject = (id: string) => {
        setComplaintToReject(id);
        setIsRejectModalOpen(true);
        setIsModalOpen(false);
    };

    const handleConfirmReject = async (reason: string) => {
        if (!profile) return;
        try {
            await updateComplaint(complaintToReject, {
                status: 'rejected',
                handledBy: profile as CommitteeMember,
                handledAt: new Date().toISOString(),
                rejectionReason: reason,
            });
            await fetchComplaintsData();
            setIsRejectModalOpen(false);
            setComplaintToReject('');
            alert('Complaint rejected.');
        } catch (error) {
            console.error('Error rejecting complaint:', error);
            alert('Failed to reject complaint.');
        }
    };

    const handleResolve = async (id: string) => {
        try {
            await updateComplaint(id, {
                status: 'resolved',
            });
            await fetchComplaintsData();
            setIsModalOpen(false);
            alert('Complaint resolved.');
        } catch (error) {
            console.error('Error resolving complaint:', error);
            alert('Failed to resolve complaint.');
        }
    };

    return (
        <Layout userType="committee">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Search Bar */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Search by ID, resident name, block, or issue..."
                        />
                    </div>
                </div>

                {/* Stats Cards */}
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

                {/* Pending Complaints Table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-lg font-bold text-gray-900">Pending Complaints</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        ID
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Resident
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Block
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Issue
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {pendingComplaints.length > 0 ? (
                                    pendingComplaints.map((complaint) => (
                                        <ComplaintCard
                                            key={complaint.id}
                                            complaint={complaint}
                                            onEvaluate={handleEvaluate}
                                            onResolve={handleResolve}
                                            onView={handleView}
                                        />
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="px-4 py-16 text-center text-gray-400">
                                            <div className="flex flex-col items-center gap-2">
                                                <svg className="w-12 h-12 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <p className="text-lg font-medium">All caught up!</p>
                                                <p className="text-sm">No pending complaints to evaluate.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Evaluated Complaints Table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-lg font-bold text-gray-900">Evaluated Complaints</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        ID
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Resident
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Block
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Issue
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
                                {evaluatedComplaints.length > 0 ? (
                                    evaluatedComplaints.map((complaint) => (
                                        <ComplaintCard
                                            key={complaint.id}
                                            complaint={complaint}
                                            onEvaluate={handleEvaluate}
                                            onResolve={handleResolve}
                                            onView={handleView}
                                        />
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="px-4 py-12 text-center text-gray-400">
                                            <p className="text-lg font-medium">No records found</p>
                                            <p className="text-sm">Historical complaints will appear here.</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Detail Modal */}
            <ComplaintDetailModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedComplaint(null);
                }}
                complaint={selectedComplaint}
                onAccept={handleAccept}
                onReject={handleReject}
                onResolve={handleResolve}
            />

            {/* Reject Reason Modal */}
            <RejectReasonModal
                isOpen={isRejectModalOpen}
                onClose={() => {
                    setIsRejectModalOpen(false);
                    setComplaintToReject('');
                }}
                onConfirm={handleConfirmReject}
                complaintId={complaintToReject}
            />
        </Layout>
    );
};

export default ComplaintsPage;
