import React, { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { db } from '../lib/firebase';
import { doc, setDoc, updateDoc } from 'firebase/firestore';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
};

export const AuthProvider = ({ children }) => {
    const [profile, setProfile] = useState(null);

    // Load profile from localStorage on mount
    useEffect(() => {
        const savedProfile = localStorage.getItem('shipChatProfile');
        const cookieUserId = Cookies.get('shipChatUserId');

        if (savedProfile) {
            const parsedProfile = JSON.parse(savedProfile);
            setProfile(parsedProfile);
        }
    }, []);

    const updateProfileStatus = async (userId, isOnline) => {
        try {
            const userRef = doc(db, 'profiles', userId);
            await updateDoc(userRef, {
                online: isOnline,
                updatedAt: new Date().toISOString()
            });
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    const saveProfile = async (profileData) => {
        try {
            setProfile(profileData);
            localStorage.setItem('shipChatProfile', JSON.stringify(profileData));

            const profileId = profileData.id || `user_${Date.now()}`;
            const newProfile = {
                ...profileData,
                id: profileId,
                updatedAt: new Date().toISOString(),
                online: true
            };

            setProfile(newProfile);
            localStorage.setItem('shipChatProfile', JSON.stringify(newProfile));
            Cookies.set('shipChatUserId', profileId, { expires: 7 });
            if (newProfile.shipId) Cookies.set('shipChatShipId', newProfile.shipId, { expires: 7 });

            await setDoc(doc(db, 'profiles', profileId), newProfile, { merge: true });
        } catch (error) {
            console.error('Error saving profile:', error);
        }
    };

    // Heartbeat Effect: Update timestamp every 60s
    useEffect(() => {
        if (!profile?.id) return;

        const updateHeartbeat = () => {
            updateProfileStatus(profile.id, true);
        };

        updateHeartbeat();
        const interval = setInterval(updateHeartbeat, 60000);

        return () => clearInterval(interval);
    }, [profile?.id]);

    const value = {
        profile,
        saveProfile,
        updateProfileStatus
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
