import React, { useState } from 'react';
import Modal from './Modal';
import { useAppContext } from '../context/AppContext';

const UsersModal = () => {
    const { openModal, setOpenModal, currentShipId, users, setSelectedUser, addMockUser } = useAppContext();
    const [searchTerm, setSearchTerm] = useState('');

    const shipUsers = users.filter(u => u.shipId === currentShipId);
    const filteredUsers = shipUsers.filter(u =>
        u.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleUserClick = (user) => {
        setSelectedUser(user);
        setOpenModal('chat');
    };

    return (
        <Modal isOpen={openModal === 'users'} onClose={() => setOpenModal(null)} title="Crew Members" size="default">
            <div className="p-4">
                <div className="mb-4">
                    <div className="relative">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search crew..."
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <svg className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>
                <div className="space-y-2">
                    {filteredUsers.map(user => (
                        <div key={user.id} className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <img src={user.avatar} alt={user.name} className="w-12 h-12 rounded-full object-cover" />
                                    {user.online && (
                                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                                    )}
                                </div>
                                <div>
                                    <div className="font-semibold text-gray-900">{user.name}</div>
                                    <div className="text-sm text-gray-600">{user.online ? 'Online' : 'Offline'}</div>
                                </div>
                            </div>
                            <button
                                onClick={() => handleUserClick(user)}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                            >
                                Chat
                            </button>
                        </div>
                    ))}
                    {filteredUsers.length === 0 && (
                        <div className="text-center py-8 text-gray-500">No crew members found</div>
                    )}
                </div>

                {/* Debug / Manual Seed */}
                <div className="mt-4 pt-4 border-t border-gray-100 flex justify-center">
                    <button 
                        onClick={async () => {
                            await addMockUser();
                            alert('Mock user Ivy Chen added! Check "Asian Pearl" ship.');
                        }}
                        className="text-xs text-blue-500 hover:underline"
                    >
                        + Add Mock User (Ivy)
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default UsersModal;
