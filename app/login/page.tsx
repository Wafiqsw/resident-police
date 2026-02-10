'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from '@/lib/auth';

export default function LoginPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const { profile } = await signIn(email, password);

            if (profile.role === 'resident') {
                router.push('/resident');
            } else if (profile.role === 'committee') {
                router.push('/committee');
            }
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Failed to sign in. Please check your credentials.');
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 mb-8 group">
                <div className="bg-indigo-600 p-2 rounded-xl group-hover:scale-110 transition-transform shadow-lg shadow-indigo-100">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                </div>
                <span className="text-2xl font-bold text-gray-900 tracking-tight">Resident Watch</span>
            </Link>

            <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl shadow-indigo-100/50 p-8 border border-gray-100 overflow-hidden relative">
                {/* Decorative background */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full -translate-y-1/2 translate-x-1/2 -z-10"></div>

                <div className="mb-8 text-center md:text-left">
                    <h1 className="text-3xl font-extrabold text-gray-900">Welcome Back</h1>
                    <p className="text-gray-500 mt-2">Log in to your account to continue</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-sm font-medium">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-5">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                        <input
                            type="email"
                            required
                            placeholder="name@example.com"
                            className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all placeholder:text-gray-400"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <div className="flex justify-between mb-2">
                            <label className="text-sm font-bold text-gray-700">Password</label>
                            <Link href="#" className="text-xs font-bold text-indigo-600 hover:text-indigo-700">Forgot Password?</Link>
                        </div>
                        <input
                            type="password"
                            required
                            placeholder="••••••••"
                            className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all placeholder:text-gray-400"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

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
                                Logging in...
                            </>
                        ) : 'Sign In'}
                    </button>
                </form>

                <div className="mt-10 text-center">
                    <p className="text-gray-500 text-sm">
                        Don't have an account? {' '}
                        <Link href="/register" className="text-indigo-600 font-bold hover:text-indigo-700">Get access</Link>
                    </p>
                </div>
            </div>

            <p className="mt-8 text-gray-400 text-xs text-center max-w-xs">
                By logging in, you agree to our Terms of Service and Privacy Policy.
            </p>
        </div>
    );
}
