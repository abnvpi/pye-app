import React, { useEffect, useState } from 'react';
import { useAppContext } from '../context/AppContext';

const UserHoverCard = () => {
    const { hoveredUser, setHoveredUser, setSelectedUser, setOpenModal } = useAppContext();
    const [isVisible, setIsVisible] = useState(false);
    const [position, setPosition] = useState({ top: 0, left: 0 });
    const [displayUser, setDisplayUser] = useState(null); // Local state to hold user data

    useEffect(() => {
        if (hoveredUser) {
            setDisplayUser(hoveredUser); // Update local state
            setIsVisible(true);
            setPosition({
                top: hoveredUser.position.y,
                left: hoveredUser.position.x
            });
        } else {
            // Delay hiding to allow moving to card
            const timer = setTimeout(() => setIsVisible(false), 300); // Increased to 300ms for smoother transition
            return () => clearTimeout(timer);
        }
    }, [hoveredUser]);

    const handleMouseEnter = () => {
        // If we are hovering the card, restore the global hover state using local data
        if (displayUser) {
            setHoveredUser(displayUser);
        }
    };

    const handleMouseLeave = () => {
        setHoveredUser(null);
    };

    const handleChat = () => {
        if (displayUser) {
            setSelectedUser(displayUser.user);
            setOpenModal('chat');
            setHoveredUser(null);
        }
    };

    // Only return null if we have no data to show AND we are not visible
    if (!displayUser || (!isVisible && !hoveredUser)) return null;

    const { user } = displayUser;

    return (
        <div
            className={`fixed z-50 bg-white rounded-xl shadow-2xl p-4 w-[200px] transition-[opacity,transform] duration-300 ease-out pointer-events-auto transform -translate-x-1/2 -translate-y-full -mt-2 ${isVisible ? 'opacity-100 translate-y-[-100%] scale-100' : 'opacity-0 translate-y-[-90%] scale-95'}`}
            style={{ top: position.top, left: position.left }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <div className="flex flex-col items-center">
                <div className="relative mb-2">
                    <img src={user.avatar} alt={user.name} className="w-16 h-16 rounded-full object-cover border-2 border-blue-100" />
                    {user.online && (
                        <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                </div>
                <h3 className="font-bold text-gray-900 text-center truncate w-full">{user.name}</h3>
                <p className="text-xs text-gray-500 mb-3">{user.online ? 'Online' : 'Offline'}</p>

                <button
                    onClick={handleChat}
                    className="w-full bg-blue-600 text-white py-1.5 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-1"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    Chat
                </button>
            </div>

            {/* Arrow pointing down */}
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white rotate-45 shadow-sm"></div>
        </div>
    );
};

// Memoize to prevent re-renders when hover state hasn't changed
export default React.memo(UserHoverCard);
