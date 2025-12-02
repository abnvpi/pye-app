import React, { useEffect, useState } from 'react';
import { useAppContext } from '../context/AppContext';

const CrewHoverCard = () => {
    const { hoveredCrew, setHoveredCrew, setOpenModal, setSelectedUser } = useAppContext();
    const [isVisible, setIsVisible] = useState(false);
    const [position, setPosition] = useState({ top: 0, left: 0 });
    const [displayData, setDisplayData] = useState(null);

    useEffect(() => {
        if (hoveredCrew) {
            setDisplayData(hoveredCrew);
            setIsVisible(true);
            setPosition({
                top: hoveredCrew.position.y,
                left: hoveredCrew.position.x
            });
        } else {
            const timer = setTimeout(() => setIsVisible(false), 300);
            return () => clearTimeout(timer);
        }
    }, [hoveredCrew]);

    const handleMouseEnter = () => {
        if (displayData) {
            setHoveredCrew(displayData);
        }
    };

    const handleMouseLeave = () => {
        setHoveredCrew(null);
    };

    const handleOpenChat = () => {
        setSelectedUser(null); // Ensure list view
        setOpenModal('chat');
        setHoveredCrew(null);
    };

    if (!displayData || (!isVisible && !hoveredCrew)) return null;

    // Safety check
    if (!displayData.position) return null;

    const { totalUsers } = displayData;

    return (
        <div
            className={`fixed z-50 bg-white rounded-xl shadow-2xl p-4 w-[220px] transition-[opacity,transform] duration-300 ease-out pointer-events-auto transform -translate-x-1/2 -translate-y-full -mt-2 ${isVisible ? 'opacity-100 translate-y-[-100%] scale-100' : 'opacity-0 translate-y-[-90%] scale-95'}`}
            style={{ top: position.top, left: position.left }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <div className="flex flex-col">
                <div className="flex items-center justify-between mb-3 border-b border-gray-100 pb-2">
                    <h3 className="font-bold text-gray-900">Ship Crew</h3>
                    <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-0.5 rounded-full">{totalUsers} Members</span>
                </div>

                <div className="mb-4">
                    <p className="text-gray-500 text-sm">Click to view all crew members and start a conversation.</p>
                </div>

                <button
                    onClick={handleOpenChat}
                    className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    Message Crew
                </button>
            </div>

            {/* Arrow pointing down */}
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white rotate-45 shadow-sm"></div>

            {/* Invisible bridge to catch mouse events when moving from marker to card */}
            <div className="absolute -bottom-4 left-0 right-0 h-4 bg-transparent"></div>
        </div>
    );
};

// Memoize to prevent re-renders when hover state hasn't changed
export default React.memo(CrewHoverCard);
