import React, { useState } from 'react';
import Modal from './Modal';
import ChatUserList from './ChatUserList';
import ChatWindow from './ChatWindow';
import { useAppContext } from '../context/AppContext';
import { getChannelId } from '../utils/helpers';

const ChatModal = () => {
    const {
        openModal,
        setOpenModal,
        selectedUser,
        setSelectedUser,
        profile,
        messages,
        sendMessage,
        users,
        currentShipId,
        loadMoreMessages,
        hasMoreMessages,
        loadingMore
    } = useAppContext();

    const [searchTerm, setSearchTerm] = useState('');

    // List View Logic
    const safeUsers = Array.isArray(users) ? users : [];
    const shipUsers = safeUsers.filter(u => u.shipId === currentShipId);

    // Chat View Logic
    const channelId = selectedUser && profile ? getChannelId(profile.id, selectedUser.id) : null;
    const chatMessages = channelId ? messages[channelId] || [] : [];

    const handleSendMessage = (text) => {
        if (!text.trim() || !selectedUser) return;
        sendMessage(selectedUser.id, text);
    };

    const handleBackToList = () => {
        setSelectedUser(null);
    };

    // RENDER LIST VIEW
    if (!selectedUser) {
        return (
            <Modal isOpen={openModal === 'chat'} onClose={() => setOpenModal(null)} title="Messages" size="default">
                <ChatUserList
                    users={shipUsers}
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    onSelectUser={setSelectedUser}
                />
            </Modal>
        );
    }

    // RENDER CHAT VIEW
    return (
        <Modal isOpen={openModal === 'chat'} onClose={() => setOpenModal(null)} title={
            <div className="flex items-center gap-3">
                <button onClick={handleBackToList} className="p-1 hover:bg-gray-100 rounded-full mr-1">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <img src={selectedUser.avatar} className="w-8 h-8 rounded-full" alt="" />
                <span>{selectedUser.name}</span>
            </div>
        } size="default">
            <ChatWindow
                selectedUser={selectedUser}
                messages={chatMessages}
                onSendMessage={handleSendMessage}
                hasMoreMessages={hasMoreMessages[channelId] || false}
                loadMoreMessages={loadMoreMessages}
                loadingMore={loadingMore}
            />
        </Modal>
    );
};

export default ChatModal;

