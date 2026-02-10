'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';
import { UserType, getNavigationByUserType } from '@/constants';
import { useAuth } from '@/hooks/useAuth';

interface LayoutProps {
    children: React.ReactNode;
    userType: UserType;
}

const Layout: React.FC<LayoutProps> = ({ children, userType }) => {
    const { user, profile, loading } = useAuth();
    const router = useRouter();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const navigation = getNavigationByUserType(userType);

    // Protection logic
    useEffect(() => {
        if (!loading) {
            if (!user) {
                router.push('/login');
            } else if (profile && profile.role !== userType) {
                // Prevent resident from accessing committee pages and vice versa
                router.push(profile.role === 'resident' ? '/resident' : '/committee');
            }
        }
    }, [user, profile, loading, userType, router]);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const closeSidebar = () => {
        setIsSidebarOpen(false);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-gray-500 font-medium">Loading your profile...</p>
                </div>
            </div>
        );
    }

    if (!user || !profile) {
        return null; // Will redirect via useEffect
    }

    // Determine display name
    const displayName = profile.role === 'resident' ? profile.fullName : 'Committee Member';

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Sidebar */}
            <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} navigation={navigation} />

            {/* Main Container - slides with sidebar */}
            <div
                className={`min-h-screen flex flex-col transition-all duration-300 ease-in-out ${isSidebarOpen ? 'lg:ml-64' : 'ml-0'
                    }`}
            >
                {/* Header */}
                <Header onMenuClick={toggleSidebar} userType={userType} userName={displayName} />

                {/* Main Content Area */}
                <main className="flex-1 bg-[#F5F7FA]">
                    <div className="p-6">{children}</div>
                </main>

                {/* Footer */}
                <Footer />
            </div>
        </div>
    );
};

export default Layout;
