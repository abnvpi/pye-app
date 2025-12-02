import React, { useState } from 'react';
import Modal from './Modal';
import { useAppContext } from '../context/AppContext';

const UserPreviewModal = () => {
    const { openModal, setOpenModal, selectedUser, setSelectedUser, profile, reportUser, userReports } = useAppContext();
    const [showReportConfirm, setShowReportConfirm] = useState(false);

    const handleChat = () => {
        setOpenModal('chat');
    };

    const handleReport = () => {
        if (!profile?.id || !selectedUser?.id) return;

        reportUser(selectedUser.id, profile.id);
        setShowReportConfirm(false);
        setOpenModal(null);
        setSelectedUser(null);
    };



    if (!selectedUser) return null;

    const alreadyReported = userReports[selectedUser.id]?.includes(profile?.id);
    const reportCount = userReports[selectedUser.id]?.length || 0;

    return (
        <Modal isOpen={openModal === 'userPreview'} onClose={() => { setOpenModal(null); setSelectedUser(null); }} title="User Profile" size="small">
            <div className="p-6 text-center">
                <div className="relative inline-block mb-4">
                    <img src={selectedUser.avatar} alt={selectedUser.name} className="w-24 h-24 rounded-full object-cover mx-auto" />
                    {selectedUser.online && (
                        <div className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-1">{selectedUser.name}</h3>
                <p className="text-sm text-gray-600 mb-6">
                    {selectedUser.online ? 'Online' : 'Offline'}
                </p>

                {/* Start Chat Button */}
                <button
                    onClick={handleChat}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 mb-3"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    Start Chat
                </button>



                {/* Report Button */}
                {!showReportConfirm ? (
                    <button
                        onClick={() => setShowReportConfirm(true)}
                        disabled={alreadyReported}
                        className={`w-full py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 ${alreadyReported
                            ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                            : 'bg-red-50 text-red-600 hover:bg-red-100'
                            }`}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                        </svg>
                        {alreadyReported ? 'Already Reported' : `Report User ${reportCount > 0 ? `(${reportCount}/5)` : ''}`}
                    </button>
                ) : (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <p className="text-sm text-red-800 mb-3">Are you sure you want to report this user?</p>
                        <div className="flex gap-2">
                            <button
                                onClick={handleReport}
                                className="flex-1 bg-red-600 text-white py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors"
                            >
                                Yes, Report
                            </button>
                            <button
                                onClick={() => setShowReportConfirm(false)}
                                className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </Modal>
    );
};

export default UserPreviewModal;
