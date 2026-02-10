'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { registerCommittee } from '@/lib/auth';
import { CommitteeMember } from '@/types';

export default function CommitteeRegisterPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
    });

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const committeeProfile: Omit<CommitteeMember, 'id'> = {
                email: formData.email,
                role: 'committee',
            };

            await registerCommittee(committeeProfile as CommitteeMember, formData.password);

            router.push('/committee');
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

            <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl shadow-indigo-100/50 p-8 md:p-12 border border-gray-100 relative overflow-hidden">
                <div className="mb-10 text-center md:text-left">
                    <h1 className="text-3xl font-extrabold text-gray-900">Committee Only</h1>
                    <p className="text-gray-500 mt-2">Register as a committee member or administrator</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-sm font-medium">
                        {error}
                    </div>
                )}

                <form onSubmit={handleRegister} className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                        <input
                            type="email"
                            required
                            placeholder="admin@pdrm.gov.my"
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Password</label>
                        <input
                            type="password"
                            required
                            placeholder="••••••••"
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Confirm Password</label>
                        <input
                            type="password"
                            required
                            placeholder="••••••••"
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all"
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        />
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 active:scale-95 flex items-center justify-center gap-2 disabled:opacity-70 disabled:active:scale-100"
                        >
                            {isLoading ? 'Creating account...' : 'Register as Committee'}
                        </button>
                    </div>
                </form>

                <div className="mt-8 text-center">
                    <Link href="/login" className="text-gray-500 text-sm font-medium hover:text-indigo-600 transition-colors">
                        Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
}
