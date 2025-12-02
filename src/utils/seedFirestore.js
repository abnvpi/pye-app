import { db } from '../lib/firebase';
import { collection, doc, setDoc, writeBatch } from 'firebase/firestore';

const ships = [
    {
        id: 'ship_001',
        name: 'Pacific Explorer',
        route: 'Sydney → Auckland → Fiji → Vanuatu → New Caledonia',
        coordinates: [
            { lng: 151.2093, lat: -33.8688 },
            { lng: 174.7633, lat: -36.8485 },
            { lng: 178.4419, lat: -18.1416 },
            { lng: 168.3167, lat: -17.7333 },
            { lng: 166.4580, lat: -22.2758 }
        ]
    },
    {
        id: 'ship_002',
        name: 'Caribbean Dream',
        route: 'Miami → Key West → Cozumel → Grand Cayman → Jamaica',
        coordinates: [
            { lng: -80.1918, lat: 25.7617 },
            { lng: -81.7800, lat: 24.5551 },
            { lng: -86.9223, lat: 20.5083 },
            { lng: -81.2546, lat: 19.3133 },
            { lng: -77.8939, lat: 18.4762 }
        ]
    },
    {
        id: 'ship_003',
        name: 'Mediterranean Star',
        route: 'Barcelona → Monaco → Florence → Rome → Naples → Santorini → Athens',
        coordinates: [
            { lng: 2.1734, lat: 41.3851 },
            { lng: 7.4246, lat: 43.7384 },
            { lng: 10.3106, lat: 43.5485 },
            { lng: 11.7965, lat: 42.0942 },
            { lng: 14.2681, lat: 40.8518 },
            { lng: 25.4615, lat: 36.3932 },
            { lng: 23.7275, lat: 37.9838 }
        ]
    },
    {
        id: 'ship_004',
        name: 'Nordic Voyager',
        route: 'Oslo → Copenhagen → Stockholm → Helsinki → Tallinn → St. Petersburg',
        coordinates: [
            { lng: 10.7522, lat: 59.9139 },
            { lng: 12.5683, lat: 55.6761 },
            { lng: 18.0686, lat: 59.3293 },
            { lng: 24.9354, lat: 60.1695 },
            { lng: 24.7536, lat: 59.4370 },
            { lng: 30.3609, lat: 59.9311 }
        ]
    },
    {
        id: 'ship_005',
        name: 'Asian Pearl',
        route: 'Singapore → Phuket → Langkawi → Penang → Kuala Lumpur → Ho Chi Minh → Hong Kong',
        coordinates: [
            { lng: 103.8198, lat: 1.3521 },
            { lng: 98.3923, lat: 7.8804 },
            { lng: 99.8000, lat: 6.3500 },
            { lng: 100.3327, lat: 5.4164 },
            { lng: 101.3925, lat: 3.0044 },
            { lng: 106.7009, lat: 10.7769 },
            { lng: 114.1694, lat: 22.3193 }
        ]
    }
];

const profiles = [
    {
        id: 'user_1',
        name: 'Sarah Chen',
        avatar: 'https://i.pravatar.cc/150?u=sarah',
        department: 'Deck',
        shipId: 'ship_001',
        lat: -33.8688,
        lng: 151.2093,
        online: true,
        updatedAt: new Date().toISOString()
    },
    {
        id: 'user_2',
        name: 'Mike Ross',
        avatar: 'https://i.pravatar.cc/150?u=mike',
        department: 'Engine',
        shipId: 'ship_001',
        lat: -33.8500,
        lng: 151.2000,
        online: false,
        updatedAt: new Date(Date.now() - 10 * 60 * 1000).toISOString() // 10 minutes ago (offline)
    },
    {
        id: 'user_3',
        name: 'Emma Watson',
        avatar: 'https://i.pravatar.cc/150?u=emma',
        department: 'Hotel',
        shipId: 'ship_002',
        lat: 25.7617,
        lng: -80.1918,
        online: true,
        updatedAt: new Date().toISOString()
    },
    {
        id: 'user_4',
        name: 'James Bond',
        avatar: 'https://i.pravatar.cc/150?u=james',
        department: 'Deck',
        shipId: 'ship_003',
        lat: 41.3851,
        lng: 2.1734,
        online: true,
        updatedAt: new Date().toISOString()
    },
    {
        id: 'user_5',
        name: 'Lara Croft',
        avatar: 'https://i.pravatar.cc/150?u=lara',
        department: 'Engine',
        shipId: 'ship_004',
        lat: 59.9139,
        lng: 10.7522,
        online: false,
        updatedAt: new Date(Date.now() - 5 * 60 * 1000).toISOString() // 5 minutes ago (offline)
    },
    {
        id: 'user_6',
        name: 'Ivy Chen',
        avatar: 'https://i.pravatar.cc/150?u=ivy',
        department: 'Hotel',
        shipId: 'ship_005',
        lat: 1.3521,
        lng: 103.8198,
        online: true,
        updatedAt: new Date().toISOString()
    }
];

export const seedDatabase = async () => {
    try {
        const batch = writeBatch(db);

        // Seed Ships
        ships.forEach(ship => {
            const shipRef = doc(db, 'ships', ship.id);
            batch.set(shipRef, ship);
        });

        // Seed Profiles
        profiles.forEach(profile => {
            const profileRef = doc(db, 'profiles', profile.id);
            batch.set(profileRef, profile);
        });

        await batch.commit();
        console.log('Database seeded successfully!');
        return true;
    } catch (error) {
        console.error('Error seeding database:', error);
        return false;
    }
};
