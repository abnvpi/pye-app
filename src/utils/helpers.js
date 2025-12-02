export const getChannelId = (user1, user2) => {
    if (!user1 || !user2) return null;
    return [user1, user2].sort().join('_');
};
