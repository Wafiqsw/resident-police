'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { UnitSelector } from '@/components';
import { registerResident } from '@/lib/auth';
import { ResidentProfile } from '@/types';

export default function RegisterPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        fullName: '',
        policeId: '',
        rank: '',
        contactNumber: '',
        email: '',
        password: '',
        houseNumber: { block: '', floor: '', houseNo: '' },
        maritalStatus: 'Single',
    });

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const residentProfile: Omit<ResidentProfile, 'id'> = {
                fullName: formData.fullName,
                policeId: formData.policeId,
                rank: formData.rank,
                contactNumber: formData.contactNumber,
                email: formData.email,
                houseNumber: formData.houseNumber,
                maritalStatus: formData.maritalStatus,
                role: 'resident',
            };

            await registerResident(residentProfile as ResidentProfile, formData.password);

            router.push('/resident');
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'An error occurred during registration');
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4 py-12">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 mb-8 group">
                <div className="bg-indigo-600 p-2 rounded-xl group-hover:scale-110 transition-transform shadow-lg shadow-indigo-100">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                </div>
                <span className="text-2xl font-bold text-gray-900 tracking-tight">Resident Watch</span>
            </Link>

            <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl shadow-indigo-100/50 p-8 md:p-12 border border-gray-100 relative overflow-hidden">
                <div className="mb-10 text-center md:text-left">
                    <h1 className="text-3xl font-extrabold text-gray-900">Create Account</h1>
                    <p className="text-gray-500 mt-2">Join your police community residential portal</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-sm font-medium">
                        {error}
                    </div>
                )}

                <form onSubmit={handleRegister} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Full Name */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
                            <input
                                type="text"
                                required
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all"
                                value={formData.fullName}
                                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                            />
                        </div>

                        {/* Police ID */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Police ID</label>
                            <input
                                type="text"
                                required
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all"
                                value={formData.policeId}
                                onChange={(e) => setFormData({ ...formData, policeId: e.target.value })}
                            />
                        </div>

                        {/* Rank */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Rank</label>
                            <input
                                type="text"
                                required
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all"
                                value={formData.rank}
                                onChange={(e) => setFormData({ ...formData, rank: e.target.value })}
                            />
                        </div>

                        {/* Contact */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Contact Number</label>
                            <input
                                type="tel"
                                required
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all"
                                value={formData.contactNumber}
                                onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                            />
                        </div>

                        {/* Email */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                            <input
                                type="email"
                                required
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>

                        {/* Password */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-bold text-gray-700 mb-2">Password</label>
                            <input
                                type="password"
                                required
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                        </div>

                        {/* Marital Status */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-bold text-gray-700 mb-2">Marital Status</label>
                            <select
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all"
                                value={formData.maritalStatus}
                                onChange={(e) => setFormData({ ...formData, maritalStatus: e.target.value })}
                            >
                                <option value="Single">Single</option>
                                <option value="Married">Married</option>
                                <option value="Divorced">Divorced</option>
                                <option value="Widowed">Widowed</option>
                            </select>
                        </div>

                        {/* Residential Details - Hierarchical Selector */}
                        <UnitSelector
                            houseNumber={formData.houseNumber}
                            onChange={(houseNumber) => setFormData({ ...formData, houseNumber })}
                            required
                            className="md:col-span-2"
                        />
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 active:scale-95 flex items-center justify-center gap-2 disabled:opacity-70 disabled:active:scale-100"
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Creating account...
                                </>
                            ) : 'Create Resident Account'}
                        </button>
                    </div>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-gray-500 text-sm">
                        Already have an account? {' '}
                        <Link href="/login" className="text-indigo-600 font-bold hover:text-indigo-700">Login instead</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
