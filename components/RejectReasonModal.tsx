'use client';

import React, { useState } from 'react';

interface RejectReasonModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (reason: string) => void;
    complaintId: string;
}

const RejectReasonModal: React.FC<RejectReasonModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    complaintId,
}) => {
    const [reason, setReason] = useState('');

    if (!isOpen) return null;

    const handleSubmit = () => {
        if (!reason.trim()) {
            alert('Please provide a reason for rejection');
            return;
        }
        onConfirm(reason);
        setReason('');
    };

    const handleClose = () => {
        setReason('');
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
                {/* Header */}
                <div className="bg-gradient-to-r from-red-600 to-red-700 px-6 py-4 flex items-center justify-between rounded-t-2xl">
                    <h2 className="text-xl font-bold text-white">Reject Complaint</h2>
                    <button
                        onClick={handleClose}
                        className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    <p className="text-gray-700 mb-4">
                        You are about to reject complaint <span className="font-semibold">{complaintId}</span>.
                        Please provide a reason for rejection:
                    </p>
                    <textarea
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none resize-none"
                        rows={4}
                        placeholder="e.g., Insufficient evidence, Not a valid complaint, etc."
                    />
                </div>

                {/* Footer */}
                <div className="border-t border-gray-200 px-6 py-4 flex items-center justify-end gap-3 bg-gray-50 rounded-b-2xl">
                    <button
                        onClick={handleClose}
                        className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                    >
                        Confirm Rejection
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RejectReasonModal;
