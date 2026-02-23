import { useState, useMemo } from "react";
import { Users, Calendar, ChevronDown, ChevronUp, Search, Mail, User, Shield, CheckCircle, XCircle } from "lucide-react";
import { formatDateTime } from "../../utils";

const AdminUsersList = ({ users = [], onToggleActive, currentUserId, currentUserRole, className = "" }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const sortedUsers = useMemo(() => {
        return [...users].sort((a, b) =>
            new Date(b.createdAt) - new Date(a.createdAt)
        );
    }, [users]);

    if (!users || users.length === 0) {
        return (
            <div
                className="rounded-2xl border border-white/10 backdrop-blur-xl p-6"
                style={{
                    background: "linear-gradient(145deg, hsla(0, 0%, 100%, 0.08) 0%, hsla(0, 0%, 100%, 0.02) 100%)",
                }}
            >
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-blue-500/20">
                        <Users className="w-5 h-5 text-blue-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-white">All Users</h3>
                </div>
                <div className="text-center py-8">
                    <Users className="w-12 h-12 text-white/20 mx-auto mb-3" />
                    <p className="text-white/40">No users found</p>
                </div>
            </div>
        );
    }

    const displayedUsers = isExpanded ? sortedUsers : sortedUsers.slice(0, 5);

    const filteredUsers = searchTerm && isExpanded
        ? displayedUsers.filter(u =>
            `${u.firstName} ${u.lastName} ${u.email} ${u.role}`
                .toLowerCase()
                .includes(searchTerm.toLowerCase())
        )
        : displayedUsers;

    const hasMoreThanFive = sortedUsers.length > 5;

    const getRoleColor = (role) => {
        switch(role) {
            case 'ADMIN': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
            case 'TEACHER': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
            case 'STUDENT': return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30';
            default: return 'bg-white/10 text-white/60 border-white/10';
        }
    };

    const isToggleDisabled = (user) => {
        if (user.id === currentUserId) return true;
        if (user.role === 'ADMIN') return true;
        return false;
    };

    const getDisabledTooltip = (user) => {
        if (user.id === currentUserId) return "You cannot modify your own account";
        if (user.role === 'ADMIN') return "Admins cannot modify other admin accounts";
        return "";
    };

    return (
        <div
            className="rounded-2xl border border-white/10 backdrop-blur-xl p-6"
            style={{
                background: "linear-gradient(145deg, hsla(0, 0%, 100%, 0.08) 0%, hsla(0, 0%, 100%, 0.02) 100%)",
            }}
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-500/20">
                        <Users className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-white">All Users</h3>
                        <p className="text-xs text-white/40">{sortedUsers.length} total</p>
                    </div>
                </div>
            </div>

            {/* Search Bar */}
            {isExpanded && hasMoreThanFive && (
                <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                    <input
                        type="text"
                        placeholder="Search by name, email, or role..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-blue-500/30 text-sm"
                    />
                </div>
            )}

            {/* Users List */}
            <div className={`space-y-3 ${isExpanded ? 'max-h-[500px] overflow-y-auto custom-scrollbar pr-2' : ''}`}>
                {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => {
                        const disabled = isToggleDisabled(user);
                        const tooltip = getDisabledTooltip(user);

                        return (
                            <div
                                key={user.id}
                                className="p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors group"
                            >
                                {/* User header with name and active toggle */}
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-xs font-bold text-white shrink-0">
                                                {`${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="text-white font-medium">
                                                    {user.firstName} {user.lastName}
                                                    {user.id === currentUserId && (
                                                        <span className="ml-2 text-xs text-white/40">(You)</span>
                                                    )}
                                                </p>
                                                <div className="flex items-center gap-1 text-xs text-white/40">
                                                    <Mail className="w-3 h-3" />
                                                    <span>{user.email}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Role badge */}
                                        <div className="flex items-center gap-2 mt-2">
                                            <Shield className="w-3.5 h-3.5 text-white/40" />
                                            <span className={`text-xs px-2 py-0.5 rounded-full border ${getRoleColor(user.role)}`}>
                                                {user.role}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Active toggle button */}
                                    <button
                                        onClick={() => !disabled && onToggleActive(user.id, user.firstName, user.lastName, !user.active)}
                                        disabled={disabled}
                                        className={`p-2 rounded-lg transition-all border ${
                                            disabled
                                                ? 'bg-white/5 text-white/20 border-white/5 cursor-not-allowed'
                                                : user.active
                                                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/30'
                                                    : 'bg-rose-500/20 text-rose-400 border-rose-500/30 hover:bg-rose-500/30'
                                        }`}
                                        title={disabled ? tooltip : (user.active ? 'Deactivate user' : 'Activate user')}
                                    >
                                        {user.active ? (
                                            <CheckCircle className="w-4 h-4" />
                                        ) : (
                                            <XCircle className="w-4 h-4" />
                                        )}
                                    </button>
                                </div>

                                {/* User metadata */}
                                <div className="flex items-center gap-1.5 text-xs text-white/30 mt-2 pt-2 border-t border-white/5">
                                    <Calendar className="w-3.5 h-3.5" />
                                    <span>Joined {formatDateTime(user.createdAt)}</span>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="text-center py-4">
                        <p className="text-white/40 text-sm">No users match your search</p>
                    </div>
                )}
            </div>

            {/* Show More/Less Button */}
            {hasMoreThanFive && (
                <button
                    onClick={() => {
                        setIsExpanded(!isExpanded);
                        setSearchTerm("");
                    }}
                    className="w-full mt-4 flex items-center justify-center gap-2 py-2 rounded-lg bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 transition-all text-sm"
                >
                    {isExpanded ? (
                        <>
                            <ChevronUp className="w-4 h-4" />
                            Show Less
                        </>
                    ) : (
                        <>
                            <ChevronDown className="w-4 h-4" />
                            Show All {sortedUsers.length} Users
                        </>
                    )}
                </button>
            )}

            {/* Custom scrollbar styles */}
            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 20px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 20px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 255, 255, 0.2);
                }
            `}</style>
        </div>
    );
};

export default AdminUsersList;