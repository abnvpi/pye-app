import React from 'react';
import { AuthProvider } from './AuthContext';
import { ShipProvider } from './ShipContext';
import { UserProvider } from './UserContext';
import { ChatProvider } from './ChatContext';
import { UIProvider } from './UIContext';
import { AppContextWrapper } from './AppContext';
import { useAuth } from './AuthContext';

// Inner provider that needs auth context
const InnerProviders = ({ children }) => {
    const { profile } = useAuth();

    return (
        <UserProvider profile={profile}>
            <ChatProvider profile={profile}>
                <AppContextWrapper>
                    {children}
                </AppContextWrapper>
            </ChatProvider>
        </UserProvider>
    );
};

// Main provider that wraps all contexts
export const AppProvider = ({ children }) => {
    return (
        <AuthProvider>
            <ShipProvider>
                <UIProvider>
                    <InnerProviders>
                        {children}
                    </InnerProviders>
                </UIProvider>
            </ShipProvider>
        </AuthProvider>
    );
};

// Export all hooks for easy access
export { useAuth } from './AuthContext';
export { useChat } from './ChatContext';
export { useShip } from './ShipContext';
export { useUsers } from './UserContext';
export { useUI } from './UIContext';
export { useAppContext } from './AppContext';
