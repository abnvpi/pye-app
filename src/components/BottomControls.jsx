import React from 'react';
import { useAppContext } from '../context/AppContext';

const BottomControls = () => {
    const { setOpenModal, setSelectedUser, triggerMapAction } = useAppContext();

    return (
        <div className="fixed bottom-8 left-0 right-0 z-40 px-6 flex items-end justify-between pointer-events-none">
            {/* Left Spacer */}
            <div className="w-12"></div>

            {/* Center Main Action - Search / Find Crew */}
            <div className="pointer-events-auto transform translate-y-2">
                <button
                    onClick={() => triggerMapAction({ type: 'FOCUS_ALL' })}
                    className="w-16 h-16 bg-blue-600 text-white rounded-full shadow-2xl hover:bg-blue-700 transition-all hover:scale-105 active:scale-95 flex items-center justify-center ring-4 ring-white/20"
                    aria-label="Find Crew"
                >
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </button>
            </div>

            {/* Right Chat Action */}
            <div className="pointer-events-auto">
                <button
                    onClick={() => { setSelectedUser(null); setOpenModal('chat'); }}
                    className="w-16 h-16 backdrop-blur-xl bg-white/10 border border-white/20 text-white rounded-full shadow-2xl hover:bg-white/20 transition-all hover:scale-105 active:scale-95 flex items-center justify-center ring-1 ring-white/30"
                    aria-label="Messages"
                >
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default BottomControls;
