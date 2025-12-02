import React, { createContext, useContext, useState, useEffect } from 'react';

const UIContext = createContext();

export const useUI = () => {
    const context = useContext(UIContext);
    if (!context) throw new Error('useUI must be used within UIProvider');
    return context;
};

export const UIProvider = ({ children }) => {
    const [openModal, setOpenModal] = useState(null);
    const [mapViewAction, setMapViewAction] = useState(null);

    const triggerMapAction = (action) => {
        setMapViewAction(action);
        setTimeout(() => setMapViewAction(null), 100);
    };

    const value = {
        openModal,
        setOpenModal,
        mapViewAction,
        triggerMapAction
    };

    return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
};
