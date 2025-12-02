import React, { useState } from 'react';
import Modal from './Modal';
import { useAppContext } from '../context/AppContext';

const ShipSelectorModal = () => {
    const { openModal, setOpenModal, setCurrentShipId, ships } = useAppContext();
    const [searchTerm, setSearchTerm] = useState('');

    const filteredShips = ships.filter(ship =>
        ship.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ship.route.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSelectShip = (shipId) => {
        setCurrentShipId(shipId);
        setOpenModal(null);
    };

    return (
        <Modal isOpen={openModal === 'ships'} onClose={() => setOpenModal(null)} title="Select Your Ship" size="default">
            <div className="p-4">
                <div className="mb-4">
                    <div className="relative">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search ships..."
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <svg className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>
                <div className="space-y-2">
                    {filteredShips.map(ship => (
                        <button
                            key={ship.id}
                            onClick={() => handleSelectShip(ship.id)}
                            className="w-full text-left p-4 bg-white border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-all"
                        >
                            <div className="font-semibold text-gray-900">{ship.name}</div>
                            <div className="text-sm text-gray-600 mt-1">{ship.route}</div>
                        </button>
                    ))}
                    {filteredShips.length === 0 && (
                        <div className="text-center py-8 text-gray-500">No ships found</div>
                    )}
                </div>
            </div>
        </Modal>
    );
};

export default ShipSelectorModal;
