// Updated: 2025-12-02 18:21
import React, { lazy, Suspense } from 'react';
import { useAppContext } from '../context/AppContext';
import { MOCK_SHIPS } from '../data/mockData';
import ProfileModal from '../components/ProfileModal';
import ShipSelectorModal from '../components/ShipSelectorModal';
import UserPreviewModal from '../components/UserPreviewModal';
import UsersModal from '../components/UsersModal';
import PortModal from '../components/PortModal';
import ChatModal from '../components/ChatModal';
import BottomControls from '../components/BottomControls';

import UserHoverCard from '../components/UserHoverCard';
import CrewHoverCard from '../components/CrewHoverCard';
import ErrorBoundary from '../components/ErrorBoundary';

// Lazy load MapBackground for faster initial page load
const MapBackground = lazy(() => import('../components/MapBackground'));

const ShipChatPage = () => {
    const { currentShipId, setOpenModal, profile, ships } = useAppContext();
    // Use ships from context if available, fallback to mock if needed
    const currentShip = (ships || MOCK_SHIPS).find(s => s.id === currentShipId);

    return (
        <div className="relative h-screen w-full overflow-hidden bg-blue-50 text-gray-900 font-sans">
            {/* Background Map with Suspense */}
            <ErrorBoundary>
                <Suspense fallback={
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-slate-100 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                }>
                    <MapBackground currentShip={currentShip} />
                </Suspense>
            </ErrorBoundary>

            {/* Hover Cards */}
            <UserHoverCard />
            <CrewHoverCard />

            {/* Bottom Controls */}
            <BottomControls />

            {/* Modals */}
            <ProfileModal />
            <ShipSelectorModal />
            <UserPreviewModal />
            <UsersModal />
            <PortModal />
            <ChatModal />
        </div>
    );
};

export default ShipChatPage;
