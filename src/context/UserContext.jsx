import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, onSnapshot, doc, deleteDoc, setDoc } from 'firebase/firestore';
import { MOCK_USERS } from '../data/mockData';
import Cookies from 'js-cookie';

const UserContext = createContext();

export const useUsers = () => {
    const context = useContext(UserContext);
    if (!context) throw new Error('useUsers must be used within UserProvider');
    return context;
};

export const UserProvider = ({ children, profile }) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userReports, setUserReports] = useState({});
    const [hoveredUser, setHoveredUser] = useState(null);
    const [hoveredCrew, setHoveredCrew] = useState(null);

    // Real-time Users Listener
    useEffect(() => {
        const q = collection(db, "profiles");
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const usersList = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setUsers(usersList);
            setLoading(false);
        }, (error) => {
            console.error("Error listening to users:", error);
            setUsers(MOCK_USERS);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    // Time ticker for offline detection (updates every 30s)
    const [timeNow, setTimeNow] = useState(Date.now());
    useEffect(() => {
        const interval = setInterval(() => setTimeNow(Date.now()), 30000);
        return () => clearInterval(interval);
    }, []);

    // Derived users list with calculated online status
    const activeUsers = users.map(user => {
        if (user.id === profile?.id) return { ...user, online: true };
        if (!user.updatedAt) return { ...user, online: false };
        const lastSeen = new Date(user.updatedAt).getTime();
        const isOnline = (timeNow - lastSeen) < 2 * 60 * 1000;
        return { ...user, online: isOnline };
    });

    const reportUser = async (userId, reporterId) => {
        let shouldDelete = false;
        setUserReports(prev => {
            const reports = prev[userId] || [];
            if (reports.includes(reporterId)) return prev;
            const newReports = [...reports, reporterId];
            if (newReports.length >= 5) shouldDelete = true;
            return { ...prev, [userId]: newReports };
        });

        if (shouldDelete) deleteUser(userId);
    };

    const deleteUser = async (userId) => {
        try {
            setUsers(prev => prev.filter(u => u.id !== userId));
            await deleteDoc(doc(db, 'profiles', userId));
            if (profile?.id === userId) {
                localStorage.removeItem('shipChatProfile');
                Cookies.remove('shipChatUserId');
                Cookies.remove('shipChatShipId');
            }
        } catch (error) {
            console.error("Error deleting user:", error);
        }
    };

    const addMockUser = async () => {
        const mockUser = {
            id: `user_${Date.now()}`,
            name: 'Ivy Chen',
            avatar: 'https://i.pravatar.cc/150?u=ivy',
            department: 'Hotel',
            shipId: 'ship_005',
            lat: 1.3521,
            lng: 103.8198,
            online: true,
            updatedAt: new Date().toISOString()
        };

        try {
            await setDoc(doc(db, 'profiles', mockUser.id), mockUser);
            return true;
        } catch (e) {
            console.error('Error adding mock user:', e);
            setUsers(prev => [...prev, mockUser]);
            return true;
        }
    };

    const value = {
        users: activeUsers,
        loading,
        userReports,
        reportUser,
        deleteUser,
        hoveredUser,
        setHoveredUser,
        hoveredCrew,
        setHoveredCrew,
        addMockUser
    };

    return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
