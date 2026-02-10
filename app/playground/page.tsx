'use client';

import React, { useState } from 'react';
import { Layout } from '@/components';
import { UserType } from '@/constants';

const PlaygroundPage = () => {
    const [userType, setUserType] = useState<UserType>('committee');

    const toggleUserType = () => {
        setUserType(userType === 'committee' ? 'resident' : 'committee');
    };

    return (
        <Layout userType={userType} userName="Brandon">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* User Type Toggle Card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900 mb-1">User Type Switcher</h2>
                            <p className="text-sm text-gray-500">Switch between committee and resident views</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className={`px-4 py-2 rounded-lg font-medium text-sm ${userType === 'committee'
                                    ? 'bg-indigo-100 text-indigo-700'
                                    : 'bg-green-100 text-green-700'
                                }`}>
                                {userType === 'committee' ? 'Committee' : 'Resident'}
                            </span>
                            <button
                                onClick={toggleUserType}
                                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium text-sm"
                            >
                                Switch View
                            </button>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-medium text-gray-600">Total Residents</h3>
                            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                            </div>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <p className="text-3xl font-bold text-gray-900">1,245</p>
                            <span className="text-sm text-green-600 font-medium">↑ 12%</span>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-medium text-gray-600">Active Announcements</h3>
                            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                                </svg>
                            </div>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <p className="text-3xl font-bold text-gray-900">24</p>
                            <span className="text-sm text-green-600 font-medium">↑ 3</span>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-medium text-gray-600">Pending Requests</h3>
                            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <p className="text-3xl font-bold text-gray-900">18</p>
                            <span className="text-sm text-red-600 font-medium">↓ 5</span>
                        </div>
                    </div>
                </div>

                {/* Navigation Info */}
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-lg text-sm font-medium">Committee</span>
                            Navigation
                        </h3>
                        <ul className="space-y-3">
                            <li className="flex items-center gap-3 text-gray-700">
                                <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                                <span className="text-sm">Dashboard</span>
                            </li>
                            <li className="flex items-center gap-3 text-gray-700">
                                <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                                <span className="text-sm">Residents</span>
                            </li>
                            <li className="flex items-center gap-3 text-gray-700">
                                <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                                <span className="text-sm">Announcements</span>
                            </li>
                            <li className="flex items-center gap-3 text-gray-700">
                                <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                                <span className="text-sm">Facilities</span>
                            </li>
                            <li className="flex items-center gap-3 text-gray-700">
                                <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                                <span className="text-sm">Reports</span>
                            </li>
                            <li className="flex items-center gap-3 text-gray-700">
                                <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                                <span className="text-sm">Settings</span>
                            </li>
                        </ul>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm font-medium">Resident</span>
                            Navigation
                        </h3>
                        <ul className="space-y-3">
                            <li className="flex items-center gap-3 text-gray-700">
                                <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                                <span className="text-sm">Dashboard</span>
                            </li>
                            <li className="flex items-center gap-3 text-gray-700">
                                <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                                <span className="text-sm">My Profile</span>
                            </li>
                            <li className="flex items-center gap-3 text-gray-700">
                                <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                                <span className="text-sm">Announcements</span>
                            </li>
                            <li className="flex items-center gap-3 text-gray-700">
                                <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                                <span className="text-sm">Facilities</span>
                            </li>
                            <li className="flex items-center gap-3 text-gray-700">
                                <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                                <span className="text-sm">Payments</span>
                            </li>
                            <li className="flex items-center gap-3 text-gray-700">
                                <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                                <span className="text-sm">Support</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Features Info */}
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border border-indigo-100 p-8">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Layout Features</h2>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-1">Modern Design</h3>
                                <p className="text-sm text-gray-600">Clean white sidebar with smooth animations</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-1">Push Behavior</h3>
                                <p className="text-sm text-gray-600">Content slides when sidebar opens/closes</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-1">Role-Based Navigation</h3>
                                <p className="text-sm text-gray-600">Different menus for committee and residents</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-1">Responsive</h3>
                                <p className="text-sm text-gray-600">Mobile overlay, desktop fixed sidebar</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default PlaygroundPage;