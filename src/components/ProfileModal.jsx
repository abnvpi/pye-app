import React, { useState } from 'react';
import Modal from './Modal';
import { useAppContext } from '../context/AppContext';

const ProfileModal = () => {
    const { profile, saveProfile, openModal, setOpenModal, currentShipId, setCurrentShipId, ships, deleteUser } = useAppContext();
    const [name, setName] = useState(profile?.name || '');
    const [selectedShip, setSelectedShip] = useState(currentShipId || '');
    const [department, setDepartment] = useState(profile?.department || 'Hotel');
    const [customAvatar, setCustomAvatar] = useState(profile?.avatar || '');
    const [uploadedFile, setUploadedFile] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [isEditing, setIsEditing] = useState(!profile); // Default to editing if no profile

    // Update local state when profile changes (e.g. on re-open)
    React.useEffect(() => {
        if (profile) {
            setName(profile.name);
            setSelectedShip(profile.shipId || currentShipId || '');
            setDepartment(profile.department);
            setCustomAvatar(profile.avatar);
            setIsEditing(false);
        } else {
            setIsEditing(true);
        }
    }, [profile, currentShipId, openModal]);

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setCustomAvatar(reader.result);
                setUploadedFile(file);
            };
            reader.readAsDataURL(file);
        }
    };

    const getAvatarUrl = () => {
        if (customAvatar && uploadedFile) {
            return customAvatar;
        }
        if (customAvatar && !uploadedFile) {
            return customAvatar;
        }
        if (name.trim()) {
            return `https://ui-avatars.com/api/?name=${encodeURIComponent(name.trim())}&background=3b82f6&color=fff&size=150`;
        }
        return '';
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (name.trim()) {
            // Generate coordinates based on department
            let lat, lng;

            if (department === 'Hotel') {
                lat = Math.random() * 60 - 30;
                lng = Math.random() * 120 + 20;
            } else if (department === 'Deck') {
                lat = Math.random() * 30 + 40;
                lng = Math.random() * 100 + 10;
            } else {
                lat = Math.random() * 80 - 40;
                lng = Math.random() * 100 - 140;
            }

            // Use custom avatar if uploaded, otherwise auto-generate
            const avatar = customAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(name.trim())}&background=3b82f6&color=fff&size=150`;

            saveProfile({
                ...profile, // Keep existing ID if any
                name: name.trim(),
                avatar,
                department: department || 'Hotel',
                lat: parseFloat(lat.toFixed(4)),
                lng: parseFloat(lng.toFixed(4)),
                shipId: selectedShip
            });

            if (selectedShip) {
                setCurrentShipId(selectedShip);
            }

            setIsEditing(false);
            setOpenModal(null);
        }
    };

    const handleClose = () => {
        if (profile) {
            setOpenModal(null);
        }
    };

    const handleDelete = () => {
        if (profile?.id) {
            deleteUser(profile.id);
        } else {
            console.error('No profile ID found');
        }
    };

    return (
        <Modal isOpen={openModal === 'profile'} onClose={handleClose} title="Your Profile" size="small">
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
                {/* Avatar Preview with Upload */}
                <div className="flex justify-center">
                    <div className="relative group">
                        <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-blue-100 shadow-lg">
                            {getAvatarUrl() ? (
                                <img
                                    src={getAvatarUrl()}
                                    alt="Avatar preview"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                            )}
                        </div>
                        {/* Upload Button Overlay - Only when editing */}
                        {isEditing && (
                            <label
                                htmlFor="avatar-upload"
                                className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                            >
                                <div className="text-center">
                                    <svg className="w-6 h-6 text-white mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    <span className="text-xs text-white font-medium mt-1">Upload</span>
                                </div>
                            </label>
                        )}
                        <input
                            id="avatar-upload"
                            type="file"
                            accept="image/*"
                            onChange={handleFileUpload}
                            className="hidden"
                            disabled={!isEditing}
                        />
                    </div>
                </div>

                {/* Name Input */}
                <div>
                    <div className="flex justify-between items-center mb-2">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                            Your Name *
                        </label>
                        {!isEditing && (
                            <button
                                type="button"
                                onClick={() => setIsEditing(true)}
                                className="text-xs text-blue-600 font-semibold hover:text-blue-800 flex items-center gap-1"
                            >
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                </svg>
                                Edit
                            </button>
                        )}
                    </div>
                    <input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 ${!isEditing ? 'bg-gray-100 border-gray-200 cursor-not-allowed' : 'border-gray-300'
                            }`}
                        placeholder="Enter your name"
                        required
                        disabled={!isEditing}
                    />
                </div>

                {/* Ship Selector */}
                <div>
                    <label htmlFor="ship" className="block text-sm font-medium text-gray-700 mb-2">
                        Select Your Ship
                    </label>
                    <select
                        id="ship"
                        value={selectedShip}
                        onChange={(e) => setSelectedShip(e.target.value)}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 ${!isEditing ? 'bg-gray-100 border-gray-200 cursor-not-allowed' : 'bg-white border-gray-300'
                            }`}
                        disabled={!isEditing}
                    >
                        <option value="">Choose a ship...</option>
                        {ships.map(ship => (
                            <option key={ship.id} value={ship.id}>
                                {ship.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Department Selector */}
                <div>
                    <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-2">
                        Department *
                    </label>
                    <select
                        id="department"
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 ${!isEditing ? 'bg-gray-100 border-gray-200 cursor-not-allowed' : 'bg-white border-gray-300'
                            }`}
                        required
                        disabled={!isEditing}
                    >
                        <option value="Hotel">Hotel</option>
                        <option value="Deck">Deck</option>
                        <option value="Engine">Engine</option>
                    </select>
                </div>

                {/* Submit Button - Only show when editing */}
                {isEditing && (
                    <div className="flex gap-3">
                        <button
                            type="submit"
                            className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                        >
                            Save Changes
                        </button>
                        {profile && (
                            <button
                                type="button"
                                onClick={() => setIsEditing(false)}
                                className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                )}

                {/* Delete Account Section */}
                {profile && (
                    <div className="mt-3">
                        {!showDeleteConfirm ? (
                            <button
                                type="button"
                                onClick={() => setShowDeleteConfirm(true)}
                                className="w-full bg-red-50 text-red-600 py-3 rounded-lg font-semibold hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Delete Account
                            </button>
                        ) : (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                <p className="text-sm text-red-800 mb-3 font-semibold">⚠️ This action cannot be undone!</p>
                                <p className="text-sm text-red-700 mb-4">Are you sure you want to delete your account?</p>
                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        onClick={handleDelete}
                                        className="flex-1 bg-red-600 text-white py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors"
                                    >
                                        Yes, Delete
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowDeleteConfirm(false)}
                                        className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </form>
        </Modal>
    );
};

export default ProfileModal;
