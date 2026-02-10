'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Layout, AnnouncementCard, AnnouncementModal, AnnouncementDetailModal } from '@/components';
import { Announcement, CommitteeMember } from '@/types';
import { getAnnouncements, createAnnouncement, updateAnnouncement, deleteAnnouncement } from '@/lib/firestore';
import { uploadBase64Image, deleteFile } from '@/lib/storage';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';



const AnnouncementPage = () => {
    const { user, profile, loading: authLoading } = useAuth();
    const router = useRouter();
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
    const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);

    const fetchAnnouncementsData = useCallback(async () => {
        try {
            const data = await getAnnouncements();
            setAnnouncements(data);
        } catch (error) {
            console.error('Error fetching announcements:', error);
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
            fetchAnnouncementsData();
        }
    }, [user, profile, authLoading, router, fetchAnnouncementsData]);

    const handleAddAnnouncement = async (newAnnouncement: Omit<Announcement, 'id' | 'createdAt' | 'createdBy'>) => {
        if (!profile) return;
        try {
            let imageUrl = '';
            if (newAnnouncement.image && newAnnouncement.image.startsWith('data:image')) {
                const storagePath = `announcements/${Date.now()}_image.jpg`;
                imageUrl = await uploadBase64Image(newAnnouncement.image, storagePath);
            }

            const announcementData: Omit<Announcement, 'id'> = {
                ...newAnnouncement,
                image: imageUrl || newAnnouncement.image,
                createdAt: new Date().toISOString(),
                createdBy: profile as CommitteeMember,
            };

            await createAnnouncement(announcementData);
            await fetchAnnouncementsData();
            setIsAddModalOpen(false);
            alert('Announcement published successfully!');
        } catch (error) {
            console.error('Error adding announcement:', error);
            alert('Failed to publish announcement.');
        }
    };

    const handleUpdateAnnouncement = async (updatedData: Omit<Announcement, 'id' | 'createdAt' | 'createdBy'>) => {
        if (!editingAnnouncement) return;
        try {
            const updates = { ...updatedData };

            if (updates.image && updates.image.startsWith('data:image')) {
                const storagePath = `announcements/${Date.now()}_image.jpg`;
                updates.image = await uploadBase64Image(updates.image, storagePath);
            }

            await updateAnnouncement(editingAnnouncement.id, updates);
            await fetchAnnouncementsData();
            setEditingAnnouncement(null);
            setIsAddModalOpen(false);
            alert('Announcement updated successfully!');
        } catch (error) {
            console.error('Error updating announcement:', error);
            alert('Failed to update announcement.');
        }
    };

    const handleDeleteAnnouncement = async (id: string) => {
        if (!confirm('Are you sure you want to delete this announcement?')) return;
        try {
            const announcement = announcements.find(a => a.id === id);
            if (announcement?.image) {
                await deleteFile(announcement.image);
            }

            await deleteAnnouncement(id);
            await fetchAnnouncementsData();
            setIsDetailModalOpen(false);
            alert('Announcement deleted successfully!');
        } catch (error) {
            console.error('Error deleting announcement:', error);
            alert('Failed to delete announcement.');
        }
    };

    if (authLoading || isLoading) {
        return (
            <Layout userType="committee">
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                </div>
            </Layout>
        );
    }

    const handleViewAnnouncement = (id: string) => {
        const announcement = announcements.find(a => a.id === id);
        if (announcement) {
            setSelectedAnnouncement(announcement);
            setIsDetailModalOpen(true);
        }
    };

    const handleEditAnnouncement = (id: string) => {
        const announcement = announcements.find(a => a.id === id);
        if (announcement) {
            setEditingAnnouncement(announcement);
            setIsAddModalOpen(true);
        }
    };

    return (
        <Layout userType="committee">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Page Header */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">Announcements</h1>
                        <p className="text-gray-600">Manage and publish announcements for residents</p>
                    </div>
                    <button
                        onClick={() => {
                            setEditingAnnouncement(null);
                            setIsAddModalOpen(true);
                        }}
                        className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium flex items-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        New Announcement
                    </button>
                </div>

                {/* Announcements List */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {announcements.length > 0 ? (
                        announcements.map((announcement) => (
                            <AnnouncementCard
                                key={announcement.id}
                                announcement={announcement}
                                onView={handleViewAnnouncement}
                            />
                        ))
                    ) : (
                        <div className="col-span-full bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
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
                                    d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"
                                />
                            </svg>
                            <p className="text-gray-500 text-lg font-medium">No announcements yet</p>
                            <p className="text-gray-400 text-sm mt-2">Click "New Announcement" to create one</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Add/Edit Modal */}
            <AnnouncementModal
                isOpen={isAddModalOpen}
                onClose={() => {
                    setIsAddModalOpen(false);
                    setEditingAnnouncement(null);
                }}
                announcement={editingAnnouncement}
                onSave={editingAnnouncement ? handleUpdateAnnouncement : handleAddAnnouncement}
            />

            {/* Detail Modal */}
            <AnnouncementDetailModal
                isOpen={isDetailModalOpen}
                onClose={() => {
                    setIsDetailModalOpen(false);
                    setSelectedAnnouncement(null);
                }}
                announcement={selectedAnnouncement}
                onEdit={handleEditAnnouncement}
                onDelete={handleDeleteAnnouncement}
            />
        </Layout>
    );
};

export default AnnouncementPage;
