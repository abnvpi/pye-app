import React from 'react';
import { useAppContext } from '../context/AppContext';
import Modal from './Modal';

const PortModal = () => {
    const { selectedPort, setSelectedPort } = useAppContext();

    if (!selectedPort) return null;

    return (
        <Modal
            isOpen={!!selectedPort}
            onClose={() => setSelectedPort(null)}
            title={selectedPort.name}
        >
            <div className="flex flex-col gap-4">
                <div className="w-full h-48 rounded-xl overflow-hidden shadow-md">
                    <img
                        src={selectedPort.image}
                        alt={selectedPort.name}
                        className="w-full h-full object-cover"
                    />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">About {selectedPort.name}</h3>
                    <p className="text-gray-600 leading-relaxed">
                        {selectedPort.description}
                    </p>
                </div>
                <div className="mt-2 pt-4 border-t border-gray-100 flex justify-end">
                    <button
                        onClick={() => setSelectedPort(null)}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                    >
                        Close
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default PortModal;
