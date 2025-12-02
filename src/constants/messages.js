// User-facing messages
export const MESSAGES = {
    ERRORS: {
        PROFILE_LOAD: 'Failed to load profile',
        MESSAGE_SEND: 'Failed to send message',
        USER_DELETE: 'Failed to delete user',
        CLEANUP: 'Failed to cleanup old messages'
    },
    SUCCESS: {
        PROFILE_SAVED: 'Profile saved successfully',
        MESSAGE_SENT: 'Message sent'
    },
    NOTIFICATIONS: {
        CLEANUP: (count) => `${count} old message${count > 1 ? 's' : ''} cleared`,
        LOADING_MORE: 'Loading more messages...',
        NO_MORE_MESSAGES: 'No more messages to load'
    }
};
