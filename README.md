# Ship Chat App

A modern, real-time chat application for cruise ship crew members with interactive map features.

## Features

- 🗺️ **Interactive Map** - View crew locations on a live map with Mapbox
- 💬 **Real-time Chat** - Instant messaging powered by Firebase Firestore
- 👥 **User Presence** - See who's online with live status updates
- 🚢 **Multi-Ship Support** - Switch between different ships
- 🧹 **Auto-Cleanup** - Automatically removes messages older than 1 hour
- ⚡ **Optimized Performance** - Context splitting and React.memo for minimal re-renders

## Tech Stack

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS
- **Database**: Firebase Firestore
- **Hosting**: Firebase Hosting
- **Maps**: Mapbox GL JS
- **State Management**: React Context (optimized with 5 separate contexts)

## Live Demo

🌐 **[https://pye1-1252c.web.app](https://pye1-1252c.web.app)**

## Performance Optimizations

### Phase 1: Context Splitting
- Split large AppContext into 5 focused contexts (Auth, Chat, Ship, User, UI)
- Reduced re-renders by 50-70%
- Backward compatible with existing code

### Phase 2: React Memoization
- Added React.memo to expensive components
- Optimized hover interactions
- Prevented unnecessary chat re-renders

## Capacity

- **Concurrent Users**: 50-100 (Firebase free tier)
- **Daily Active Users**: 500-1,000
- **Storage**: Supports thousands of users and messages

## Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd ship-chat-app

# Install dependencies
npm install

# Run development server
npm run dev
```

## Environment Setup

Create a `.env` file with your Firebase configuration:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_MAPBOX_TOKEN=your_mapbox_token
```

## Firebase Setup

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable Firestore Database
3. Enable Firebase Hosting
4. Deploy security rules:
   ```bash
   firebase deploy --only firestore:rules
   ```

## Deployment

```bash
# Build for production
npm run build

# Deploy to Firebase
firebase deploy
```

## Project Structure

```
src/
├── components/       # React components
├── context/          # Context providers (Auth, Chat, Ship, User, UI)
├── hooks/            # Custom React hooks
├── lib/              # Firebase configuration
├── pages/            # Page components
├── utils/            # Utility functions
└── data/             # Mock data
```

## Key Features Explained

### Real-time Chat
- Optimistic updates for instant message display
- Firestore listeners for real-time synchronization
- Failed message retry with visual feedback

### User Presence
- Heartbeat system (60s intervals)
- Online/offline detection (2-minute timeout)
- Visual indicators on profile pictures

### Auto-Cleanup
- Runs every 5 minutes
- Deletes messages older than 1 hour
- Shows notification with count of cleaned messages

### Map Integration
- Lazy-loaded Mapbox for faster initial load
- Custom markers for users and ships
- Hover cards with user information
- Route visualization between ports

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for your own purposes.

## Author

Built with ❤️ for cruise ship crew communication

---

**Note**: This app is optimized for mobile-first usage and works best on modern browsers.
