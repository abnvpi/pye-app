import React, { useEffect, useRef } from 'react';
import ChatInput from './ChatInput';
import { useAppContext } from '../context/AppContext';

const ChatWindow = ({
    selectedUser,
    messages,
    onSendMessage
}) => {
    const messagesEndRef = useRef(null);
    const { cleanupNotification } = useAppContext();

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, selectedUser]);

    return (
        <div className="flex flex-col h-[60dvh] sm:h-[500px]">
            {/* Header / Status */}
            <div className="p-2 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                {/* Cleanup Notification */}
                {cleanupNotification && (
                    <div className="flex items-center gap-2 text-xs font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                        <span>🧹</span>
                        <span>{cleanupNotification}</span>
                    </div>
                )}
                {!cleanupNotification && <div></div>}

                {/* Online Status */}
                <div className={`flex items-center gap-2 text-xs font-medium ${selectedUser?.online ? 'text-green-600' : 'text-gray-500'}`}>
                    <div className={`w-2 h-2 rounded-full ${selectedUser?.online ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                    {selectedUser?.online ? 'Online' : 'Offline'}
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50 pb-24 sm:pb-4">
                {messages.map(msg => (
                    <div key={msg.id} className={`flex ${msg.isOwn ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[70%] ${msg.isOwn ? 'bg-blue-600 text-white' : 'bg-white text-gray-900'} rounded-lg px-4 py-2 shadow ${msg.sending ? 'opacity-70' : ''} ${msg.failed ? 'bg-red-100 border border-red-300' : ''}`}>
                            {!msg.isOwn && <div className="text-xs font-semibold mb-1 opacity-75">{msg.sender}</div>}
                            <div className="text-sm">{msg.text}</div>
                            <div className={`text-xs mt-1 flex items-center gap-1 ${msg.isOwn ? 'text-blue-100' : 'text-gray-500'}`}>
                                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                {msg.sending && <span className="ml-1">⏳</span>}
                                {msg.failed && <span className="ml-1 text-red-600">❌</span>}
                            </div>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <ChatInput onSendMessage={onSendMessage} />
        </div>
    );
};

// Memoize component to prevent unnecessary re-renders
// Only re-render when messages or selectedUser changes
export default React.memo(ChatWindow, (prevProps, nextProps) => {
    return prevProps.messages === nextProps.messages &&
        prevProps.selectedUser?.id === nextProps.selectedUser?.id;
});
