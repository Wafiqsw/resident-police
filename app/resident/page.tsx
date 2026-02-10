'use client';

import React, { useState, useEffect } from 'react';
import { Layout, SubmitComplaintModal } from '@/components';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { getAnnouncements, getComplaints, createComplaint } from '@/lib/firestore';
import { Announcement, ResidentProfile } from '@/types';
import Link from 'next/link';

const ResidentDashboard = () => {
    const { user, profile, loading: authLoading } = useAuth();
    const router = useRouter();
    const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
    const [stats, setStats] = useState({
        activeAnnouncements: 0,
        pendingComplaints: 0
    });
    const [recentAnnouncements, setRecentAnnouncements] = useState<Announcement[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!authLoading && (!user || profile?.role !== 'resident')) {
            router.push('/login');
            return;
        }

        const fetchDashboardData = async () => {
            if (!user) return;
            try {
                const [announcements, complaints] = await Promise.all([
                    getAnnouncements(),
                    getComplaints({ creatorId: user.uid })
                ]);

                // Filter active announcements (not expired)
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const active = announcements.filter(a => {
                    if (!a.expirationDate) return true;
                    return new Date(a.expirationDate) >= today;
                });

                const pending = complaints.filter(c => c.status === 'pending');

                setRecentAnnouncements(active.slice(0, 3));
                setStats({
                    activeAnnouncements: active.length,
                    pendingComplaints: pending.length
                });
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        if (user && profile) {
            fetchDashboardData();
        }
    }, [user, profile, authLoading, router]);

    const handleSubmitComplaint = async (complaintData: any) => {
        try {
            if (!profile) return;
            await createComplaint({
                ...complaintData,
                creator: profile,
                status: 'pending'
            });
            setIsSubmitModalOpen(false);
            // Refresh stats
            const complaints = await getComplaints({ creatorId: user?.uid });
            setStats(prev => ({ ...prev, pendingComplaints: complaints.filter(c => c.status === 'pending').length }));
            alert('Complaint submitted successfully!');
        } catch (error) {
            console.error('Error submitting complaint:', error);
            alert('Failed to submit complaint. Please try again.');
        }
    };

    if (authLoading || isLoading) {
        return (
            <Layout userType="resident">
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                </div>
            </Layout>
        );
    }

    const resident = profile as ResidentProfile;

    return (
        <Layout userType="resident">
            <div className="max-w-7xl mx-auto space-y-6 px-4">
                {/* Welcome Section */}
                <div className="bg-gradient-to-r from-indigo-700 to-purple-800 rounded-2xl shadow-lg p-8 text-white relative overflow-hidden">
                    <div className="relative z-10">
                        <h1 className="text-3xl font-bold mb-2">Welcome Back, {profile?.fullName.split(' ')[0]}!</h1>
                        <p className="text-indigo-100">Here's what's happening in your community today</p>
                    </div>
                    {/* Decorative background element */}
                    <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Active Announcements */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                        <div className="bg-blue-100 rounded-lg p-3 w-fit mb-4">
                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-1">{stats.activeAnnouncements}</h3>
                        <p className="text-sm text-gray-600 font-medium">Active Announcements</p>
                    </div>

                    {/* My Complaints */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                        <div className="bg-orange-100 rounded-lg p-3 w-fit mb-4">
                            <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-1">{stats.pendingComplaints}</h3>
                        <p className="text-sm text-gray-600 font-medium">Your Pending Complaints</p>
                    </div>

                    {/* Residence Info */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                        <div className="bg-green-100 rounded-lg p-3 w-fit mb-4">
                            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-1">
                            Block {resident.houseNumber.block}, Level {resident.houseNumber.floor}
                        </h3>
                        <p className="text-sm text-gray-600 font-medium">Unit {resident.houseNumber.houseNo}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Recent Announcements */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
                        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                            <h2 className="font-bold text-gray-900">Recent Announcements</h2>
                            <Link href="/resident/announcements" className="text-sm text-indigo-600 hover:text-indigo-700 font-semibold">View All</Link>
                        </div>
                        <div className="p-6 flex-1">
                            {recentAnnouncements.length > 0 ? (
                                <div className="space-y-4">
                                    {recentAnnouncements.map((announcement) => (
                                        <div key={announcement.id} className="border-l-4 border-indigo-500 pl-4 py-1 hover:bg-indigo-50/50 transition-colors rounded-r-lg">
                                            <h3 className="font-bold text-gray-900">{announcement.title}</h3>
                                            <p className="text-sm text-gray-600 line-clamp-2 mt-0.5">{announcement.details}</p>
                                            <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-wider font-bold">
                                                {new Date(announcement.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center py-8 text-gray-400">
                                    <svg className="w-12 h-12 mb-2 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                                    </svg>
                                    <p className="text-sm">No active announcements</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Quick Management */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h2 className="font-bold text-gray-900 mb-6">Quick Management</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <button
                                onClick={() => setIsSubmitModalOpen(true)}
                                className="group flex flex-col items-center justify-center p-6 bg-orange-50 rounded-2xl border-2 border-transparent hover:border-orange-200 hover:bg-orange-100/50 transition-all text-center"
                            >
                                <div className="bg-orange-500 text-white p-3 rounded-xl mb-3 group-hover:scale-110 transition-transform shadow-lg shadow-orange-100">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                </div>
                                <span className="font-bold text-orange-900">Add Complaint</span>
                                <span className="text-xs text-orange-700/70 mt-1">Report a new issue</span>
                            </button>
                            <Link
                                href="/resident/account"
                                className="group flex flex-col items-center justify-center p-6 bg-indigo-50 rounded-2xl border-2 border-transparent hover:border-indigo-200 hover:bg-indigo-100/50 transition-all text-center"
                            >
                                <div className="bg-indigo-600 text-white p-3 rounded-xl mb-3 group-hover:scale-110 transition-transform shadow-lg shadow-indigo-100">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                                <span className="font-bold text-indigo-900">My Profile</span>
                                <span className="text-xs text-indigo-700/70 mt-1">Update your info</span>
                            </Link>
                        </div>

                        {/* Additional Quick Link */}
                        <Link
                            href="/resident/complaints"
                            className="mt-4 flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group"
                        >
                            <div className="flex items-center gap-3">
                                <div className="bg-gray-200 p-2 rounded-lg text-gray-500 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <span className="font-semibold text-gray-700 group-hover:text-indigo-900">View My Case History</span>
                            </div>
                            <svg className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </Link>
                    </div>
                </div>
            </div>

            <SubmitComplaintModal
                isOpen={isSubmitModalOpen}
                onClose={() => setIsSubmitModalOpen(false)}
                onSubmit={handleSubmitComplaint}
            />
        </Layout>
    );
};

export default ResidentDashboard;
