import React, { useState, useRef, useEffect } from 'react';

const ChatInput = ({ onSendMessage, placeholder = "Type a message...", disabled = false }) => {
    const [messageText, setMessageText] = useState('');
    const inputRef = useRef(null);

    useEffect(() => {
        if (!disabled) {
            inputRef.current?.focus();
        }
    }, [disabled]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!messageText.trim()) return;

        onSendMessage(messageText.trim());
        setMessageText('');
    };

    return (
        <form onSubmit={handleSubmit} className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-white border-t border-gray-200 sm:static sm:z-auto">
            <div className="flex gap-2">
                <input
                    ref={inputRef}
                    type="text"
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder={placeholder}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                    disabled={disabled}
                />
                <button
                    type="submit"
                    disabled={disabled || !messageText.trim()}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
                >
                    Send
                </button>
            </div>
        </form>
    );
};

export default ChatInput;
