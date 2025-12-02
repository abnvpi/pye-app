import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { db } from '../lib/firebase';
import { collection, doc, setDoc, onSnapshot, query, addDoc, deleteDoc, getDocs, where, orderBy, limit, startAfter, writeBatch } from 'firebase/firestore';
import { COLLECTIONS, LIMITS, TIME } from '../constants/firestore';
import { MESSAGES } from '../constants/messages';

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
    const [hasMoreMessages, setHasMoreMessages] = useState({});
    const [loadingMore, setLoadingMore] = useState(false);

    // Real-time Messages Listener with limit
    useEffect(() => {
        if (!profile?.id || !selectedUser?.id) return;

        const channelId = [profile.id, selectedUser.id].sort().join('_');
        const q = query(
            collection(db, COLLECTIONS.CHANNELS, channelId, COLLECTIONS.MESSAGES),
            orderBy('timestamp', 'desc'),
            limit(LIMITS.MESSAGES_INITIAL)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const msgs = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                timestamp: doc.data().timestamp?.toDate().toISOString() || new Date().toISOString(),
                isOwn: doc.data().senderId === profile.id,
                sender: doc.data().senderName || 'Unknown'
            })).reverse(); // Reverse since we query desc but display asc

            setMessages(prev => ({
                ...prev,
                [channelId]: msgs
            }));

            // Set hasMore flag
            setHasMoreMessages(prev => ({
                ...prev,
                [channelId]: snapshot.docs.length >= LIMITS.MESSAGES_INITIAL
            }));
        });

        return () => unsubscribe();
    }, [profile?.id, selectedUser?.id]);

    // Auto-cleanup messages older than 1 hour
    useEffect(() => {
        const cleanupOldMessages = async () => {
            try {
                const oneHourAgo = new Date(Date.now() - TIME.MESSAGE_CLEANUP_AGE);

                // Process in batches
                const channelsQuery = query(
                    collection(db, COLLECTIONS.CHANNELS),
                    limit(LIMITS.CLEANUP_CHANNELS)
                );

                const channelsSnapshot = await getDocs(channelsQuery);
                let totalDeleted = 0;

                for (const channelDoc of channelsSnapshot.docs) {
                    const messagesRef = collection(db, COLLECTIONS.CHANNELS, channelDoc.id, COLLECTIONS.MESSAGES);
                    const oldMessagesQuery = query(
                        messagesRef,
                        where('timestamp', '<', oneHourAgo),
                        limit(LIMITS.CLEANUP_MESSAGES)
                    );

                    const oldMessagesSnapshot = await getDocs(oldMessagesQuery);

                    // Batch delete
                    if (oldMessagesSnapshot.size > 0) {
                        const batch = writeBatch(db);
                        oldMessagesSnapshot.docs.forEach(msgDoc => {
                            batch.delete(doc(db, COLLECTIONS.CHANNELS, channelDoc.id, COLLECTIONS.MESSAGES, msgDoc.id));
                        });
                        await batch.commit();
                        totalDeleted += oldMessagesSnapshot.size;
                    }
                }

                if (totalDeleted > 0) {
                    setCleanupNotification(MESSAGES.NOTIFICATIONS.CLEANUP(totalDeleted));
                    setTimeout(() => setCleanupNotification(null), 5000);
                }
            } catch (error) {
                console.error('Error cleaning up old messages:', error);
            }
        };

        cleanupOldMessages();
        const interval = setInterval(cleanupOldMessages, TIME.CLEANUP_INTERVAL);

        return () => clearInterval(interval);
    }, []);

    // Load more messages (pagination)
    const loadMoreMessages = useCallback(async () => {
        if (!profile?.id || !selectedUser?.id || loadingMore) return;

        const channelId = [profile.id, selectedUser.id].sort().join('_');
        const currentMessages = messages[channelId] || [];

        if (!hasMoreMessages[channelId] || currentMessages.length === 0) return;

        setLoadingMore(true);

        try {
            const oldestMessage = currentMessages[0];
            const q = query(
                collection(db, COLLECTIONS.CHANNELS, channelId, COLLECTIONS.MESSAGES),
                orderBy('timestamp', 'desc'),
                startAfter(new Date(oldestMessage.timestamp)),
                limit(LIMITS.MESSAGES_LOAD_MORE)
            );

            const snapshot = await getDocs(q);

            if (snapshot.empty) {
                setHasMoreMessages(prev => ({ ...prev, [channelId]: false }));
            } else {
                const newMessages = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                    timestamp: doc.data().timestamp?.toDate().toISOString() || new Date().toISOString(),
                    isOwn: doc.data().senderId === profile.id,
                    sender: doc.data().senderName || 'Unknown'
                })).reverse();

                setMessages(prev => ({
                    ...prev,
                    [channelId]: [...newMessages, ...currentMessages]
                }));

                setHasMoreMessages(prev => ({
                    ...prev,
                    [channelId]: snapshot.docs.length >= LIMITS.MESSAGES_LOAD_MORE
                }));
            }
        } catch (error) {
            console.error('Error loading more messages:', error);
        } finally {
            setLoadingMore(false);
        }
    }, [profile?.id, selectedUser?.id, messages, hasMoreMessages, loadingMore]);

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
        cleanupNotification,
        loadMoreMessages,
        hasMoreMessages,
        loadingMore
    };

    return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
