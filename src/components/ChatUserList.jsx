import React from 'react';

const ChatUserList = ({ users, searchTerm, setSearchTerm, onSelectUser }) => {
    const safeUsers = Array.isArray(users) ? users : [];
    const filteredUsers = safeUsers.filter(u =>
        u && u.name && u.name.toLowerCase().includes((searchTerm || '').toLowerCase())
    );

    return (
        <div className="p-4 h-[60dvh] sm:h-[500px] flex flex-col">
            <div className="mb-4">
                <div className="relative">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search crew..."
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <svg className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
            </div>
            <div className="flex-1 overflow-y-auto space-y-2">
                {filteredUsers.map(user => (
                    <button
                        key={user.id}
                        onClick={() => onSelectUser(user)}
                        className="w-full flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
                    >
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <img src={user.avatar} alt={user.name} className="w-12 h-12 rounded-full object-cover" />
                                {user.online && (
                                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                                )}
                            </div>
                            <div>
                                <div className="font-semibold text-gray-900">{user.name}</div>
                                <div className="text-sm text-gray-600">{user.online ? 'Online' : 'Offline'}</div>
                            </div>
                        </div>
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                ))}
                {filteredUsers.length === 0 && (
                    <div className="text-center py-8 text-gray-500">No crew members found</div>
                )}
            </div>
        </div>
    );
};

// Memoize to prevent re-renders when users list hasn't changed
export default React.memo(ChatUserList, (prevProps, nextProps) => {
    return prevProps.users === nextProps.users &&
        prevProps.selectedUser?.id === nextProps.selectedUser?.id &&
        prevProps.searchTerm === nextProps.searchTerm;
});
