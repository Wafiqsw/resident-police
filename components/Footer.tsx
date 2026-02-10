import React from 'react';
import Link from 'next/link';

const Footer: React.FC = () => {
    return (
        <footer className="bg-white border-t border-gray-200 mt-auto">
            <div className="px-6 py-4">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    {/* Copyright */}
                    <p className="text-sm text-gray-600">
                        © {new Date().getFullYear()} Residents Association, Taman Desa Baiduri
                    </p>

                    {/* Quick Links */}
                    <div className="flex gap-6">
                        <Link
                            href="/privacy"
                            className="text-sm text-gray-600 hover:text-indigo-600 transition-colors"
                        >
                            Privacy Policy
                        </Link>
                        <Link
                            href="/terms"
                            className="text-sm text-gray-600 hover:text-indigo-600 transition-colors"
                        >
                            Terms of Service
                        </Link>
                        <Link
                            href="/contact"
                            className="text-sm text-gray-600 hover:text-indigo-600 transition-colors"
                        >
                            Contact Us
                        </Link>
                    </div>

                    {/* Version */}
                    <p className="text-xs text-gray-400">v1.0.0</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
