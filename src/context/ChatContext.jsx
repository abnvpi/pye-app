import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { db } from '../lib/firebase';
import { collection, doc, setDoc, onSnapshot, query, addDoc, deleteDoc, getDocs, where } from 'firebase/firestore';

const ChatContext = createContext();

export const useChat = () => {
    const context = useContext(ChatContext);
    if (!context) throw new Error('useChat must be used within ChatProvider');
    return context;
};

export const ChatProvider = ({ children, profile }) => {
    const [messages, setMessages] = useState({});
    const [selectedUser, setSelectedUser] = useState(null);
    const [cleanupNotification, setCleanupNotification] = useState(null);

    // Real-time Messages Listener
    useEffect(() => {
        if (!profile?.id || !selectedUser?.id) return;

        const channelId = [profile.id, selectedUser.id].sort().join('_');
        const q = query(collection(db, 'channels', channelId, 'messages'));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const msgs = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                timestamp: doc.data().timestamp?.toDate().toISOString() || new Date().toISOString(),
                isOwn: doc.data().senderId === profile.id,
                sender: doc.data().senderName || 'Unknown'
            })).sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

            setMessages(prev => ({
                ...prev,
                [channelId]: msgs
            }));
        });

        return () => unsubscribe();
    }, [profile?.id, selectedUser?.id]);

    // Auto-cleanup messages older than 1 hour
    useEffect(() => {
        const cleanupOldMessages = async () => {
            try {
                const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
                const channelsSnapshot = await getDocs(collection(db, 'channels'));

                let totalDeleted = 0;

                for (const channelDoc of channelsSnapshot.docs) {
                    const messagesRef = collection(db, 'channels', channelDoc.id, 'messages');
                    const oldMessagesQuery = query(
                        messagesRef,
                        where('timestamp', '<', oneHourAgo)
                    );

                    const oldMessagesSnapshot = await getDocs(oldMessagesQuery);

                    for (const msgDoc of oldMessagesSnapshot.docs) {
                        await deleteDoc(doc(db, 'channels', channelDoc.id, 'messages', msgDoc.id));
                        totalDeleted++;
                    }
                }

                if (totalDeleted > 0) {
                    setCleanupNotification(`${totalDeleted} old message${totalDeleted > 1 ? 's' : ''} cleared`);
                    setTimeout(() => setCleanupNotification(null), 5000);
                }
            } catch (error) {
                console.error('Error cleaning up old messages:', error);
            }
        };

        cleanupOldMessages();
        const interval = setInterval(cleanupOldMessages, 5 * 60 * 1000);

        return () => clearInterval(interval);
    }, []);

    const sendMessage = async (toUserId, text) => {
        if (!profile?.id) return;

        const channelId = [profile.id, toUserId].sort().join('_');

        const tempId = `temp_${Date.now()}`;
        const optimisticMessage = {
            id: tempId,
            text,
            senderId: profile.id,
            senderName: profile.name,
            timestamp: new Date().toISOString(),
            type: 'text',
            isOwn: true,
            sender: profile.name,
            sending: true
        };

        setMessages(prev => ({
            ...prev,
            [channelId]: [...(prev[channelId] || []), optimisticMessage]
        }));

        const messageData = {
            text,
            senderId: profile.id,
            senderName: profile.name,
            timestamp: new Date(),
            type: 'text'
        };

        try {
            await setDoc(doc(db, 'channels', channelId), {
                participants: [profile.id, toUserId],
                lastMessage: messageData,
                updatedAt: new Date()
            }, { merge: true });

            await addDoc(collection(db, 'channels', channelId, 'messages'), messageData);

            setMessages(prev => ({
                ...prev,
                [channelId]: (prev[channelId] || []).filter(m => m.id !== tempId)
            }));
        } catch (error) {
            console.error('Error sending message:', error);
            setMessages(prev => ({
                ...prev,
                [channelId]: (prev[channelId] || []).map(m =>
                    m.id === tempId ? { ...m, failed: true, sending: false } : m
                )
            }));
        }
    };

    const value = {
        messages,
        selectedUser,
        setSelectedUser,
        sendMessage,
        cleanupNotification
    };

    return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
