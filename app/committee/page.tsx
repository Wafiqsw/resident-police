'use client';

import React, { useState, useEffect } from 'react';
import { Layout } from '@/components';
import { getAnnouncements, getComplaints, getAllResidents } from '@/lib/firestore';
import { Complaint, Announcement, ResidentProfile } from '@/types';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const CommitteeDashboard = () => {
    const { user, profile, loading: authLoading } = useAuth();
    const router = useRouter();
    const [stats, setStats] = useState({
        totalResidents: 0,
        pendingComplaints: 0,
        activeAnnouncements: 0,
        totalComplaints: 0
    });
    const [urgentComplaints, setUrgentComplaints] = useState<Complaint[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!authLoading && (!user || profile?.role !== 'committee')) {
            router.push('/login');
            return;
        }

        const fetchDashboardData = async () => {
            try {
                const [residents, complaints, announcements] = await Promise.all([
                    getAllResidents(),
                    getComplaints(),
                    getAnnouncements()
                ]);

                // Filter active announcements
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const activeAnnouncements = announcements.filter(a => {
                    if (!a.expirationDate) return true;
                    return new Date(a.expirationDate) >= today;
                });

                const pending = complaints.filter(c => c.status === 'pending');

                setStats({
                    totalResidents: residents.length,
                    pendingComplaints: pending.length,
                    activeAnnouncements: activeAnnouncements.length,
                    totalComplaints: complaints.length
                });

                // Get top 3 urgent (pending) complaints
                setUrgentComplaints(pending.slice(0, 5));
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        if (user) {
            fetchDashboardData();
        }
    }, [user, profile, authLoading, router]);

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
                {/* Welcome Section */}
                <div className="bg-gradient-to-r from-indigo-700 to-purple-800 rounded-2xl shadow-lg p-8 text-white relative overflow-hidden">
                    <div className="relative z-10">
                        <h1 className="text-3xl font-bold mb-2">Welcome Back, {profile?.fullName || 'Committee'}</h1>
                        <p className="text-indigo-100 italic">"Serving the community with integrity and excellence."</p>
                    </div>
                    {/* Decorative background element */}
                    <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {/* Total Residents */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                        <div className="bg-blue-100 rounded-lg p-3 w-fit mb-4">
                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-1">{stats.totalResidents}</h3>
                        <p className="text-sm text-gray-600 font-medium">Total Residents</p>
                    </div>

                    {/* Pending Complaints */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                        <div className="bg-orange-100 rounded-lg p-3 w-fit mb-4">
                            <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-1">{stats.pendingComplaints}</h3>
                        <p className="text-sm text-gray-600 font-medium">Pending Complaints</p>
                    </div>

                    {/* Active Announcements */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                        <div className="bg-green-100 rounded-lg p-3 w-fit mb-4">
                            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-1">{stats.activeAnnouncements}</h3>
                        <p className="text-sm text-gray-600 font-medium">Active Announcements</p>
                    </div>

                    {/* Maintenance Requests */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                        <div className="bg-purple-100 rounded-lg p-3 w-fit mb-4">
                            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-1">{stats.totalComplaints}</h3>
                        <p className="text-sm text-gray-600 font-medium">Lifetime Complaints</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Recent Complaints */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                            <h2 className="font-bold text-gray-900">Urgent Complaints</h2>
                            <a href="/committee/complaints" className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">View All</a>
                        </div>
                        <div className="divide-y divide-gray-100">
                            {urgentComplaints.length > 0 ? (
                                urgentComplaints.map((complaint) => (
                                    <Link
                                        key={complaint.id}
                                        href="/committee/complaints"
                                        className="p-4 hover:bg-indigo-50/50 transition-colors flex items-center justify-between group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 shrink-0">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">{complaint.issue}</h4>
                                                <p className="text-xs text-gray-500">{complaint.creator.fullName} • Block {complaint.creator.houseNumber.block}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-[10px] font-bold uppercase tracking-wider text-orange-500 bg-orange-50 px-2 py-0.5 rounded">Urgent</span>
                                            <p className="text-[10px] text-gray-400 mt-1">{new Date(complaint.dateSubmitted).toLocaleDateString()}</p>
                                        </div>
                                    </Link>
                                ))
                            ) : (
                                <div className="p-8 text-center text-gray-400">
                                    <svg className="w-12 h-12 mx-auto mb-2 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <p className="text-sm">Great job! No pending complaints.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h2 className="font-bold text-gray-900 mb-4">Management Actions</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <Link href="/committee/announcement" className="flex flex-col items-center justify-center p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors text-center group">
                                <div className="bg-blue-600 text-white p-2 rounded-lg mb-2 group-hover:scale-110 transition-transform shadow-lg shadow-blue-100">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                </div>
                                <span className="text-sm font-semibold text-blue-900">Post Announcement</span>
                            </Link>
                            <Link href="/committee/residents" className="flex flex-col items-center justify-center p-4 bg-indigo-50 rounded-xl hover:bg-indigo-100 transition-colors text-center group">
                                <div className="bg-indigo-600 text-white p-2 rounded-lg mb-2 group-hover:scale-110 transition-transform shadow-lg shadow-indigo-100">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                </div>
                                <span className="text-sm font-semibold text-indigo-900">Manage Residents</span>
                            </Link>
                            <Link href="/committee/complaints" className="flex flex-col items-center justify-center p-4 bg-orange-50 rounded-xl hover:bg-orange-100 transition-colors text-center group">
                                <div className="bg-orange-600 text-white p-2 rounded-lg mb-2 group-hover:scale-110 transition-transform shadow-lg shadow-orange-100">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                </div>
                                <span className="text-sm font-semibold text-orange-900">Review Complaints</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default CommitteeDashboard;
