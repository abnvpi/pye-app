import React, { createContext, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useChat } from './ChatContext';
import { useShip } from './ShipContext';
import { useUsers } from './UserContext';
import { useUI } from './UIContext';

const AppContext = createContext();

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) throw new Error('useAppContext must be used within AppProvider');
    return context;
};

// Compatibility wrapper that combines all contexts
export const AppContextWrapper = ({ children }) => {
    const auth = useAuth();
    const chat = useChat();
    const ship = useShip();
    const users = useUsers();
    const ui = useUI();

    // Auto-open profile modal if no profile exists
    useEffect(() => {
        if (!auth.profile && ui.openModal === null) {
            ui.setOpenModal('profile');
        }
    }, [auth.profile, ui.openModal, ui.setOpenModal]);

    // Combine all context values into one object for backward compatibility
    const value = {
        // Auth
        profile: auth.profile,
        saveProfile: auth.saveProfile,
        updateProfileStatus: auth.updateProfileStatus,

        // Chat
        messages: chat.messages,
        selectedUser: chat.selectedUser,
        setSelectedUser: chat.setSelectedUser,
        sendMessage: chat.sendMessage,
        cleanupNotification: chat.cleanupNotification,

        // Ship
        ships: ship.ships,
        currentShipId: ship.currentShipId,
        setCurrentShipId: ship.setCurrentShipId,
        selectedPort: ship.selectedPort,
        setSelectedPort: ship.setSelectedPort,

        // Users
        users: users.users,
        loading: users.loading,
        userReports: users.userReports,
        reportUser: users.reportUser,
        deleteUser: users.deleteUser,
        hoveredUser: users.hoveredUser,
        setHoveredUser: users.setHoveredUser,
        hoveredCrew: users.hoveredCrew,
        setHoveredCrew: users.setHoveredCrew,
        addMockUser: users.addMockUser,

        // UI
        openModal: ui.openModal,
        setOpenModal: ui.setOpenModal,
        mapViewAction: ui.mapViewAction,
        triggerMapAction: ui.triggerMapAction
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
