'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Layout, AnnouncementCard, AnnouncementDetailModal } from '@/components';
import { Announcement } from '@/types';
import { getAnnouncements } from '@/lib/firestore';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

const ResidentAnnouncements = () => {
    const { user, profile, loading: authLoading } = useAuth();
    const router = useRouter();
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);

    const fetchAnnouncements = useCallback(async () => {
        try {
            const data = await getAnnouncements();

            // Filter out expired announcements
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const activeAnnouncements = data.filter(announcement => {
                if (!announcement.expirationDate) return true;
                const expDate = new Date(announcement.expirationDate);
                expDate.setHours(0, 0, 0, 0);
                return expDate >= today;
            });

            setAnnouncements(activeAnnouncements);
        } catch (error) {
            console.error('Error fetching announcements:', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (!authLoading && (!user || profile?.role !== 'resident')) {
            router.push('/login');
            return;
        }
        if (user) {
            fetchAnnouncements();
        }
    }, [user, profile, authLoading, router, fetchAnnouncements]);

    const handleViewAnnouncement = (id: string) => {
        const announcement = announcements.find((a) => a.id === id);
        if (announcement) {
            setSelectedAnnouncement(announcement);
            setIsDetailModalOpen(true);
        }
    };

    if (authLoading || isLoading) {
        return (
            <Layout userType="resident">
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout userType="resident">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h1 className="text-2xl font-bold text-gray-900">Announcements</h1>
                    <p className="text-gray-600 mt-1">Stay updated with the latest community news</p>
                </div>

                {/* Announcements Grid */}
                {announcements.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {announcements.map((announcement) => (
                            <AnnouncementCard
                                key={announcement.id}
                                announcement={announcement}
                                onView={handleViewAnnouncement}
                            />
                        ))}
                    </div>
                ) : (
                    /* Empty State */
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-16 text-center">
                        <div className="bg-orange-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-10 h-10 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">No Active Announcements</h3>
                        <p className="text-gray-500 max-w-sm mx-auto">
                            Everything is quiet at the moment. New community updates will appear here when they are published.
                        </p>
                    </div>
                )}
            </div>

            {/* Announcement Detail Modal */}
            <AnnouncementDetailModal
                isOpen={isDetailModalOpen}
                onClose={() => {
                    setIsDetailModalOpen(false);
                    setSelectedAnnouncement(null);
                }}
                announcement={selectedAnnouncement}
                readOnly={true}
            />
        </Layout>
    );
};

export default ResidentAnnouncements;

