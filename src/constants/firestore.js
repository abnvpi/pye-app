// Firestore collection names
export const COLLECTIONS = {
    PROFILES: 'profiles',
    SHIPS: 'ships',
    CHANNELS: 'channels',
    MESSAGES: 'messages'
};

// Query limits
export const LIMITS = {
    MESSAGES_INITIAL: 50,
    MESSAGES_LOAD_MORE: 20,
    CLEANUP_CHANNELS: 10,
    CLEANUP_MESSAGES: 100
};

// Time constants (in milliseconds)
export const TIME = {
    MESSAGE_CLEANUP_AGE: 60 * 60 * 1000,  // 1 hour
    CLEANUP_INTERVAL: 5 * 60 * 1000,      // 5 minutes
    HEARTBEAT_INTERVAL: 60 * 1000,        // 1 minute
    ONLINE_TIMEOUT: 2 * 60 * 1000         // 2 minutes
};
