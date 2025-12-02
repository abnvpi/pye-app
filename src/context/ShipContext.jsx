import React, { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { db } from '../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { MOCK_SHIPS } from '../data/mockData';
import { seedDatabase } from '../utils/seedFirestore';

const ShipContext = createContext();

export const useShip = () => {
    const context = useContext(ShipContext);
    if (!context) throw new Error('useShip must be used within ShipProvider');
    return context;
};

export const ShipProvider = ({ children }) => {
    const [ships, setShips] = useState([]);
    const [currentShipId, setCurrentShipId] = useState(null);
    const [selectedPort, setSelectedPort] = useState(null);

    // Fetch ships on mount
    useEffect(() => {
        const fetchShips = async () => {
            try {
                const shipsSnapshot = await getDocs(collection(db, 'ships'));
                const shipsData = shipsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

                if (shipsData.length === 0) {
                    await seedDatabase();
                    setShips(MOCK_SHIPS);
                } else {
                    setShips(shipsData);
                }
            } catch (error) {
                console.error('Error fetching ships:', error);
                setShips(MOCK_SHIPS);
            }
        };

        fetchShips();

        const timeoutId = setTimeout(() => {
            if (ships.length === 0) {
                console.warn('Data load timeout, falling back to mock data');
                setShips(MOCK_SHIPS);
            }
        }, 3000);

        return () => clearTimeout(timeoutId);
    }, []);

    // Load ship from cookie
    useEffect(() => {
        const cookieShipId = Cookies.get('shipChatShipId');
        if (cookieShipId) setCurrentShipId(cookieShipId);
    }, []);

    const value = {
        ships,
        currentShipId,
        setCurrentShipId,
        selectedPort,
        setSelectedPort
    };

    return <ShipContext.Provider value={value}>{children}</ShipContext.Provider>;
};
