export const MAPBOX_TOKEN = 'pk.eyJ1IjoiYWJoaW5hdnBrIiwiYSI6ImNtaWsyMjd5OTA4NnQzZXNkemc1dnNmbzUifQ.H6yTpT79hqfx5nA8GJG9SA';

export const MOCK_SHIPS = [
    {
        id: 'ship_001',
        name: 'Pacific Explorer',
        route: 'Sydney → Auckland → Fiji',
        coordinates: [[151.2093, -33.8688], [174.7633, -36.8485], [178.4419, -18.1416]],
        ports: [
            { name: 'Sydney', description: 'The harbor city, famous for its Opera House and Bridge.', image: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=800&q=80' },
            { name: 'Auckland', description: 'City of Sails, known for its vibrant waterfront and volcanic hills.', image: 'https://images.unsplash.com/photo-1507699622177-48857e0e5528?auto=format&fit=crop&w=800&q=80' },
            { name: 'Fiji', description: 'Tropical paradise with crystal clear waters and friendly culture.', image: 'https://images.unsplash.com/photo-1544251668-3742568a7f1d?auto=format&fit=crop&w=800&q=80' }
        ]
    },
    {
        id: 'ship_002',
        name: 'Caribbean Dream',
        route: 'Miami → Nassau → Cozumel',
        coordinates: [[-80.1918, 25.7617], [-77.3504, 25.0443], [-86.9223, 20.5083]],
        ports: [
            { name: 'Miami', description: 'Vibrant city with beautiful beaches and art deco architecture.', image: 'https://images.unsplash.com/photo-1535498730771-e735b998cd64?auto=format&fit=crop&w=800&q=80' },
            { name: 'Nassau', description: 'Capital of the Bahamas, known for its beaches and coral reefs.', image: 'https://images.unsplash.com/photo-1548574505-5e239809ee19?auto=format&fit=crop&w=800&q=80' },
            { name: 'Cozumel', description: 'Mexican island famous for scuba diving and ancient Mayan ruins.', image: 'https://images.unsplash.com/photo-1512813195386-6cf811ad3542?auto=format&fit=crop&w=800&q=80' }
        ]
    },
    {
        id: 'ship_003',
        name: 'Mediterranean Star',
        route: 'Barcelona → Rome → Athens',
        coordinates: [[2.1734, 41.3851], [12.4964, 41.9028], [23.7275, 37.9838]],
        ports: [
            { name: 'Barcelona', description: 'Cosmopolitan capital of Spain’s Catalonia region, known for art and architecture.', image: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&w=800&q=80' },
            { name: 'Rome', description: 'The Eternal City, home to the Colosseum and Vatican City.', image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=800&q=80' },
            { name: 'Athens', description: 'Heart of Ancient Greece, dominated by the 5th-century BC landmarks.', image: 'https://images.unsplash.com/photo-1603565816030-6b389eeb23cb?auto=format&fit=crop&w=800&q=80' }
        ]
    },
    {
        id: 'ship_004',
        name: 'Nordic Voyager',
        route: 'Oslo → Bergen → Reykjavik',
        coordinates: [[10.7522, 59.9139], [5.3221, 60.3913], [-21.8952, 64.1466]],
        ports: [
            { name: 'Oslo', description: 'Norwegian capital known for green spaces and museums.', image: 'https://images.unsplash.com/photo-1588064643233-49210b27b82e?auto=format&fit=crop&w=800&q=80' },
            { name: 'Bergen', description: 'Colorful houses on old wharf, gateway to the fjords.', image: 'https://images.unsplash.com/photo-1516331138075-f3ad72194054?auto=format&fit=crop&w=800&q=80' },
            { name: 'Reykjavik', description: 'Iceland’s coastal capital, renowned for the late-night clubs and bars.', image: 'https://images.unsplash.com/photo-1476610182048-b716b8518aae?auto=format&fit=crop&w=800&q=80' }
        ]
    },
    {
        id: 'ship_005',
        name: 'Asian Pearl',
        route: 'Singapore → Bangkok → Hong Kong',
        coordinates: [[103.8198, 1.3521], [100.5018, 13.7563], [114.1694, 22.3193]],
        ports: [
            { name: 'Singapore', description: 'Island city-state off southern Malaysia, a global financial center.', image: 'https://images.unsplash.com/photo-1565967511849-76a60a516170?auto=format&fit=crop&w=800&q=80' },
            { name: 'Bangkok', description: 'Capital of Thailand, known for ornate shrines and vibrant street life.', image: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=800&q=80' },
            { name: 'Hong Kong', description: 'Major port and global financial hub with a skyline studded with skyscrapers.', image: 'https://images.unsplash.com/photo-1506318137071-a8bcbf6755dd?auto=format&fit=crop&w=800&q=80' }
        ]
    },
];

export const MOCK_USERS = [
    { id: 'user_001', name: 'Alice Johnson', shipId: 'ship_001', lat: -33.8688, lng: 151.2093, online: true, avatar: 'https://i.pravatar.cc/150?img=1', department: 'Hotel' },
    { id: 'user_002', name: 'Bob Smith', shipId: 'ship_001', lat: -36.8485, lng: 174.7633, online: true, avatar: 'https://i.pravatar.cc/150?img=2', department: 'Deck' },
    { id: 'user_003', name: 'Carol Davis', shipId: 'ship_001', lat: -18.1416, lng: 178.4419, online: false, avatar: 'https://i.pravatar.cc/150?img=3', department: 'Engine' },
    { id: 'user_004', name: 'David Wilson', shipId: 'ship_002', lat: 25.7617, lng: -80.1918, online: true, avatar: 'https://i.pravatar.cc/150?img=4', department: 'Hotel' },
    { id: 'user_005', name: 'Emma Brown', shipId: 'ship_002', lat: 25.0443, lng: -77.3504, online: true, avatar: 'https://i.pravatar.cc/150?img=5', department: 'Deck' },
    { id: 'user_006', name: 'Frank Miller', shipId: 'ship_003', lat: 41.3851, lng: 2.1734, online: false, avatar: 'https://i.pravatar.cc/150?img=6', department: 'Engine' },
    { id: 'user_007', name: 'Grace Lee', shipId: 'ship_003', lat: 41.9028, lng: 12.4964, online: true, avatar: 'https://i.pravatar.cc/150?img=7', department: 'Hotel' },
    { id: 'user_008', name: 'Henry Taylor', shipId: 'ship_004', lat: 59.9139, lng: 10.7522, online: true, avatar: 'https://i.pravatar.cc/150?img=8', department: 'Deck' },
    { id: 'user_009', name: 'Ivy Chen', shipId: 'ship_005', lat: 1.3521, lng: 103.8198, online: true, avatar: 'https://i.pravatar.cc/150?img=9', department: 'Hotel' },
];
