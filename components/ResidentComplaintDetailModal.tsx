'use client';

import React from 'react';
import { Complaint } from '@/types';

interface ResidentComplaintDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    complaint: Complaint | null;
    onEdit?: (id: string) => void;
    onDelete?: (id: string) => void;
}

const ResidentComplaintDetailModal: React.FC<ResidentComplaintDetailModalProps> = ({
    isOpen,
    onClose,
    complaint,
    onEdit,
    onDelete,
}) => {
    if (!isOpen || !complaint) return null;

    const canEdit = complaint.status === 'pending';

    const handleDelete = () => {
        if (onDelete && confirm('Are you sure you want to delete this complaint?')) {
            onDelete(complaint.id);
            onClose();
        }
    };

    const handleEdit = () => {
        if (onEdit) {
            onEdit(complaint.id);
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-white">Complaint Details</h2>
                    <button
                        onClick={onClose}
                        className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    <div className="space-y-4">
                        {/* Complaint ID */}
                        <div className="flex border-b border-gray-200 pb-3">
                            <div className="w-1/3">
                                <p className="text-sm font-semibold text-gray-600">Complaint ID:</p>
                            </div>
                            <div className="w-2/3">
                                <p className="text-gray-900 font-medium">{complaint.id}</p>
                            </div>
                        </div>

                        {/* Category */}
                        <div className="flex border-b border-gray-200 pb-3">
                            <div className="w-1/3">
                                <p className="text-sm font-semibold text-gray-600">Category:</p>
                            </div>
                            <div className="w-2/3">
                                <p className="text-gray-900">{complaint.category}</p>
                            </div>
                        </div>

                        {/* Issue */}
                        <div className="flex border-b border-gray-200 pb-3">
                            <div className="w-1/3">
                                <p className="text-sm font-semibold text-gray-600">Issue:</p>
                            </div>
                            <div className="w-2/3">
                                <p className="text-gray-900">{complaint.issue}</p>
                            </div>
                        </div>

                        {/* Series Number */}
                        <div className="flex border-b border-gray-200 pb-3">
                            <div className="w-1/3">
                                <p className="text-sm font-semibold text-gray-600">Series Number:</p>
                            </div>
                            <div className="w-2/3">
                                <p className="text-gray-900">{complaint.seriesNumber}</p>
                            </div>
                        </div>

                        {/* Last User */}
                        <div className="flex border-b border-gray-200 pb-3">
                            <div className="w-1/3">
                                <p className="text-sm font-semibold text-gray-600">Last User:</p>
                            </div>
                            <div className="w-2/3">
                                <p className="text-gray-900">{complaint.lastUser || 'N/A'}</p>
                            </div>
                        </div>

                        {/* Date Broken */}
                        <div className="flex border-b border-gray-200 pb-3">
                            <div className="w-1/3">
                                <p className="text-sm font-semibold text-gray-600">Date Broken:</p>
                            </div>
                            <div className="w-2/3">
                                <p className="text-gray-900">{new Date(complaint.dateBroken).toLocaleDateString()}</p>
                            </div>
                        </div>

                        {/* Broken Details */}
                        <div className="flex border-b border-gray-200 pb-3">
                            <div className="w-1/3">
                                <p className="text-sm font-semibold text-gray-600">Broken Details:</p>
                            </div>
                            <div className="w-2/3">
                                <p className="text-gray-900">{complaint.brokenDetails}</p>
                            </div>
                        </div>

                        {/* Date Submitted */}
                        <div className="flex border-b border-gray-200 pb-3">
                            <div className="w-1/3">
                                <p className="text-sm font-semibold text-gray-600">Date Submitted:</p>
                            </div>
                            <div className="w-2/3">
                                <p className="text-gray-900">
                                    {new Date(complaint.dateSubmitted).toLocaleDateString()}, {new Date(complaint.dateSubmitted).toLocaleTimeString()}
                                </p>
                            </div>
                        </div>

                        {/* Proof Picture */}
                        <div className="flex flex-col border-b border-gray-200 pb-3">
                            <p className="text-sm font-semibold text-gray-600 mb-3">Proof Picture:</p>
                            <div className="rounded-lg overflow-hidden bg-gray-100 border-2 border-dashed border-gray-300">
                                {complaint.proofPicture ? (
                                    <img
                                        src={complaint.proofPicture}
                                        alt="Proof"
                                        className="w-full h-64 object-contain"
                                    />
                                ) : (
                                    <div className="w-full h-64 flex items-center justify-center">
                                        <div className="text-center">
                                            <svg className="w-16 h-16 text-gray-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            <p className="text-gray-400 text-sm">No proof image</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Status (if not pending) */}
                        {complaint.status !== 'pending' && (
                            <>
                                <div className="flex border-b border-gray-200 pb-3">
                                    <div className="w-1/3">
                                        <p className="text-sm font-semibold text-gray-600">Status:</p>
                                    </div>
                                    <div className="w-2/3">
                                        <span
                                            className={`px-3 py-1 text-sm font-medium rounded-full ${complaint.status === 'accepted'
                                                ? 'bg-blue-100 text-blue-700'
                                                : complaint.status === 'resolved'
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-red-100 text-red-700'
                                                }`}
                                        >
                                            {complaint.status === 'accepted' ? 'Accepted' : complaint.status === 'resolved' ? 'Resolved' : 'Rejected'}
                                        </span>
                                    </div>
                                </div>
                                {complaint.handledBy && (
                                    <div className="flex border-b border-gray-200 pb-3">
                                        <div className="w-1/3">
                                            <p className="text-sm font-semibold text-gray-600">Handled By:</p>
                                        </div>
                                        <div className="w-2/3">
                                            <p className="text-gray-900">{complaint.handledBy.email}</p>
                                        </div>
                                    </div>
                                )}
                                {complaint.rejectionReason && (
                                    <div className="flex border-b border-gray-200 pb-3">
                                        <div className="w-1/3">
                                            <p className="text-sm font-semibold text-gray-600">Rejection Reason:</p>
                                        </div>
                                        <div className="w-2/3">
                                            <p className="text-gray-900">{complaint.rejectionReason}</p>
                                        </div>
                                    </div>
                                )}
                                {complaint.resolutionDetails && (
                                    <div className="flex border-b border-gray-200 pb-3">
                                        <div className="w-1/3">
                                            <p className="text-sm font-semibold text-gray-600">Resolution Details:</p>
                                        </div>
                                        <div className="w-2/3">
                                            <p className="text-gray-900">{complaint.resolutionDetails}</p>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 flex items-center justify-between">
                    {canEdit && onDelete ? (
                        <button
                            onClick={handleDelete}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Delete
                        </button>
                    ) : (
                        <div></div>
                    )}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={onClose}
                            className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium"
                        >
                            Close
                        </button>
                        {canEdit && onEdit && (
                            <button
                                onClick={handleEdit}
                                className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium flex items-center gap-2"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                Edit
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResidentComplaintDetailModal;
